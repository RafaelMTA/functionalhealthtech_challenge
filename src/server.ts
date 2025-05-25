import { ApolloServer } from 'apollo-server';
import { connectDB } from './config/database';
import { typeDefs as AccountTypeDefs } from './graphql/typedefs/account.typedefs';
import { typeDefs as TransactionTypeDefs } from './graphql/typedefs/transaction.typedefs';
import { resolvers as AccountResolvers } from './graphql/resolvers/account.resolvers';
import { resolvers as TransactionResolvers } from './graphql/resolvers/transaction.resolvers';
import { AccountRepository } from './repositories/account/account.repository';
import { AccountService } from './services/account/account.service';
import { TransactionService } from './services/transaction/transaction.service';
import { formatError } from './utils/error.formatter';

const startServer = async () => {
    await connectDB();

    const accountRepository = new AccountRepository();
    const accountService = new AccountService(accountRepository);
    const transactionService = new TransactionService(accountRepository);

    const server = new ApolloServer({
        typeDefs: [AccountTypeDefs, TransactionTypeDefs],
        resolvers: [AccountResolvers(accountService), TransactionResolvers(transactionService)],
        formatError,
        cache: 'bounded',
        persistedQueries: false,
    });

    const port = process.env.PORT || 4000;

    server.listen({ port }).then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
}

startServer().catch((error) => {
    console.error('Error starting server:', error);
});