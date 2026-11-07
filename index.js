require('./app.js')

exports.handler = async () => {
  return {
    statusCode: 200,
    body: "web service run by startCommand, ignore this handler"
  }
}
