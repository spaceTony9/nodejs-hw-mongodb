import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createNewDir } from './utils/createNewDir.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  try {
    await initMongoConnection();
    await createNewDir(TEMP_UPLOAD_DIR);
    await createNewDir(UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.log('failed running bootstrap func', error.message);
  }
};

bootstrap();
