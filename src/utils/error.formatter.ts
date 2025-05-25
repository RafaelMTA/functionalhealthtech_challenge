import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AppError } from '../errors/applicationErrors';

export function formatError(error: GraphQLError): GraphQLFormattedError {
    delete error.stack;

    if (error.originalError instanceof AppError) {
        return {
            message: error.message,
            extensions: {
                code: error.originalError.code
            }
        };
    }

    return {
        message: 'Erro interno do servidor',
        extensions: {
            code: 500
        }
    };
}
