import app from './app';
import mongoConnect from './utlis/db';

const port = process.env.PORT || 8080;
(async () => {
  try {
    await mongoConnect();
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  } catch (error) {
    console.log('Server error', (error as Error).message);
  }
})();
