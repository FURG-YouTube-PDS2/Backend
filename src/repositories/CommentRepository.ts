import { EntityRepository, Repository} from 'typeorm';

import Comment from '../models/Comment'

class commentRepository extends Repository<Comment> {
    // Função assincrona, precisa retornar uma promise
    // No caso, pode retornar o comentário, ou nulo (caso nao encontre)
    public async findByDate(date: Date): Promise<Comment | null> {
        // Quando escrevemos "this." poderemos ver a gama e funções disponíveis
        // pela classe "Repository" do typeorm.
        const findComment = await this.findOne({
            where: { date },
        })
    }     

    //
}

// const response = await findByDate(date)
// findByDate(date).then(response => )

export default commentRepository;