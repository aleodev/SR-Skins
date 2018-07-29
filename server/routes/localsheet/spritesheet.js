

module.exports = (app) => {

  app.get('/localsheet/sendSprites', (req, res, next) => {
    res.send('hello world')
  })

  // app.post('/localsheet/sendSprites',urlencodedParser, function(req, res, next) {
  //
  // })


}
