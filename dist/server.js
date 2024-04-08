import 'module-alias/register';
import mongoose from 'mongoose';
import { globSync } from 'glob';
import path from 'path';
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
    console.log('Please upgrade your Node.js version to at least 20 or greater. 👌\n ');
    process.exit();
}
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
mongoose.connection.on('error', (error) => {
    console.log(`1. 🔥 Common Error caused issue → : check your .env file first and add your MongoDB URL`);
    console.error(`2. 🚫 Error → : ${error.message}`);
});
const modelsFiles = globSync('./src/models/**/*.ts');
for (const filePath of modelsFiles) {
    require(path.resolve(filePath));
}
import app from './app';
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → On PORT : ${server.address().port}`);
});
