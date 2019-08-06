import app from './app';

const runner = require('./test-runner');

const PORT = process.env.PORT || 8000;

//Start our server and tests!
app.listen(PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 1500);
  }
});

export default app;
