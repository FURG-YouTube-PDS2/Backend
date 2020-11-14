import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import commentRepository from '../repositories/CommentRepository'

interface Request {
    user: string;
    date: Date;
}

class CreateCommentService {
    public async execute({ date, user}: Request): Promise<Comment> {
        // Recebe todos os metodos de repositorio
        //const customRepository = getCustomRepository()

        const commentDate = startOfHour(date);

        const findCommentInSameDate = await commentRepository.findByDate(
            commentDate,
        )

        if ( findCommentInSameDate ) {
            throw Error ('Comentario já publicado')
        }

        const comment = commentRepository.create({
            user,
            date: commentDate,
        });

        // efetivamente salva o comentario no banco de dados
        await commentRepository.save(comment);

        return comment;
    }
}

export default CreateCommentService;
