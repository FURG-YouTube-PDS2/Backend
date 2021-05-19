import { getRepository, getManager } from 'typeorm';

import Video from '../models/Video';
import User from '../models/User';
import Tags from '../models/Tags';
import UserVideo from '../models/UserVideo';
import TagsVideos from '../models/TagsVideo';
import Subscription from '../models/Subscription';
import Playlist from '../models/Playlist';
import PlaylistVideo from '../models/PlaylistVideo';

import checkJwt from '../middlewares/checkJwt';

interface Request {
	input: string;
	type: number;
	token: string;
}

class SearchService {
	public async execute({ input, type, token }: Request): Promise<object> {
		try {
			const videoRepository = getRepository(Video);
			const userRepository = getRepository(User);
			const tagRepository = getRepository(Tags);
			const tagVideoRepository = getRepository(TagsVideos);
			const playlistRepositosry = getRepository(Playlist);
			const playVideoRepository = getRepository(PlaylistVideo);

			if (tagRepository) {
				if (type === 0) {
					var tag = await tagRepository.findOne({
						select: ['id'],
						where: { name: input },
					});
					var v_ids = await tagVideoRepository.find({
						select: ['video_id'],
						where: { tag_id: tag!.id },
					});
					var videos_id = new Array();
					videos_id.push('teste');
					for (let i = 0; i < v_ids.length; i++) {
						videos_id.push(v_ids[i].video_id);
					}

					var playlists = await getManager()
						.createQueryBuilder(PlaylistVideo, 'pv')
						.select('playlist_id', 'pl_id')
						.addSelect('name', 'name')
						.addSelect((subQuery) => {
							return subQuery
								.select('COUNT(*)')
								.from(PlaylistVideo, 'plv')
								.where('plv.playlist_id = pv.playlist_id');
						}, 'video_count')
						.addSelect((subQuery) => {
							return subQuery
								.select('v.id', 'video_id')
								.from(Video, 'v')
								.innerJoin(PlaylistVideo, 'plv', 'p.id = plv.playlist_id')
								.where('plv.position = 0 AND plv.video_id = v.id');
						}, 'video_id')
						.distinct(true)
						.innerJoin(Playlist, 'p', 'p.id = pv.playlist_id')
						.where('p.public = true AND pv.video_id IN (:...videos_id)', { videos_id })
						.orderBy('video_count', 'DESC')
						.limit(2)
						.getRawMany();

					var videos = await getManager()
						.createQueryBuilder(Video, 'v')
						.select('v.id', 'id')
						.addSelect('v.title', 'title')
						.addSelect('v.description', 'description')
						.addSelect('v.privacy', 'privacy')
						.addSelect('v.created_at', 'created_at')
						.addSelect('uv.is_owner', 'owner')
						.addSelect('uv.user_id', 'channel_id')
						.addSelect((subQuery) => {
							return subQuery
								.select('SUM(uv.watches)', 'views')
								.from(UserVideo, 'uv')
								.where('uv.video_id = v.id');
						}, 'views')
						.addSelect((subQuery) => {
							return subQuery
								.select('u.username', 'channel_name')
								.from(User, 'u')
								.where('u.id = uv.user_id');
						}, 'channel_name')
						.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
						.where(
							'v.privacy = false AND v.id IN(:...videos_id) AND uv.is_owner = true',
							{ videos_id },
						)
						.getRawMany();
					var data = {
						videos,
						channels: new Array(),
						playlists,
					};
					return data;
				} else {
					var videos_id = new Array();
					videos_id.push('teste');
					const tag = await tagRepository
						.createQueryBuilder('tags')
						.select('tags.id', 'id')
						.where('tags.name ILIKE :searchTerm', { searchTerm: input }) // Colocar um or para descrição
						.getRawOne();

					if (tag) {
						var tag_v_ids = await tagVideoRepository.find({
							select: ['video_id'],
							where: { tag_id: tag!.id },
						});

						for (let i = 0; i < tag_v_ids.length; i++) {
							videos_id.push(tag_v_ids[i].video_id);
						}
					}

					const resultVideo = await videoRepository
						.createQueryBuilder('videos')
						.select('videos.id', 'video_id')
						.where('videos.title ~* :searchTerm', { searchTerm: input }) // Colocar um or para descrição
						.getRawMany();

					for (let i = 0; i < resultVideo.length; i++) {
						videos_id.push(resultVideo[i].video_id);
					}

					if (videos_id.length >= 1) {
						var videos = new Array();
					} else {
						var videos = await getManager()
							.createQueryBuilder(Video, 'v')
							.select('v.id', 'id')
							.addSelect('v.title', 'title')
							.addSelect('v.description', 'description')
							.addSelect('v.privacy', 'privacy')
							.addSelect('v.created_at', 'created_at')
							.addSelect('uv.is_owner', 'owner')
							.addSelect('uv.user_id', 'channel_id')
							.addSelect((subQuery) => {
								return subQuery
									.select('SUM(uv.watches)', 'views')
									.from(UserVideo, 'uv')
									.where('uv.video_id = v.id');
							}, 'views')
							.addSelect((subQuery) => {
								return subQuery
									.select('u.username', 'channel_name')
									.from(User, 'u')
									.where('u.id = uv.user_id');
							}, 'channel_name')

							.innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
							.where(
								'v.privacy = false AND v.id IN(:...videos_id) AND uv.is_owner = true',
								{ videos_id },
							)
							.getRawMany();
					}

					var playlists = await getManager()
						.createQueryBuilder(PlaylistVideo, 'pv')
						.select('playlist_id', 'pl_id')
						.addSelect('name', 'name')
						.addSelect((subQuery) => {
							return subQuery
								.select('COUNT(*)')
								.from(PlaylistVideo, 'plv')
								.where('plv.playlist_id = pv.playlist_id');
						}, 'video_count')
						.addSelect((subQuery) => {
							return subQuery
								.select('v.id', 'video_id')
								.from(Video, 'v')
								.innerJoin(PlaylistVideo, 'plv', 'p.id = plv.playlist_id')
								.where('plv.position = 0 AND plv.video_id = v.id');
						}, 'video_id')
						.distinct(true)
						.innerJoin(Playlist, 'p', 'p.id = pv.playlist_id')
						.where('p.public = true AND pv.video_id IN (:...videos_id)', { videos_id })
						.orderBy('video_count', 'DESC')
						.limit(2)
						.getRawMany();

					if (token !== '') {
						const user_id = checkJwt(token).sub;
						var resultUser = await getManager()
							.createQueryBuilder(User, 'u')
							.select('u.id', 'id')
							.addSelect('u.username', 'name')
							.addSelect((subQuery) => {
								return subQuery
									.select('COUNT(*)')
									.from(Subscription, 'subs')
									.where('subs.user_target = u.id');
							}, 'subscribers')
							.addSelect((subQuery) => {
								return subQuery
									.select('COUNT(*)')
									.from(Subscription, 'subs')
									.where(
										' subs.user_target = u.id AND user_subscriber = (:user_id)',
										{
											user_id,
										},
									);
							}, 'is_subscribed')
							.addSelect((subQuery) => {
								return subQuery
									.select('COUNT(*)')
									.from(UserVideo, 'uv')
									.where('uv.user_id = u.id AND is_owner = true');
							}, 'video_count')
							// .innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
							.where('u.id != (:user_id) AND u.username ~*:searchTerm', {
								user_id,
								searchTerm: input,
							})
							.orderBy('subscribers', 'DESC')
							.limit(2)
							.getRawMany();
					} else {
						var resultUser = await getManager()
							.createQueryBuilder(User, 'u')
							.select('u.id', 'id')
							.addSelect('u.username', 'name')
							.addSelect((subQuery) => {
								return subQuery
									.select('COUNT(*)')
									.from(Subscription, 'subs')
									.where('subs.user_target = u.id');
							}, 'subscribers')
							.addSelect((subQuery) => {
								return subQuery
									.select('COUNT(*)')
									.from(UserVideo, 'uv')
									.where('uv.user_id = u.id AND is_owner = true');
							}, 'video_count')
							// .innerJoin(UserVideo, 'uv', 'v.id = uv.video_id')
							.where('u.username ~*:searchTerm', { searchTerm: input })
							.orderBy('subscribers', 'DESC')
							.limit(2)
							.getRawMany();
					}

					var data = {
						videos,
						channels: resultUser,
						playlists,
					};
					return data;
				}
			} else {
				throw new Error('Erro ao resgatar repositório.');
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}

export default SearchService;
