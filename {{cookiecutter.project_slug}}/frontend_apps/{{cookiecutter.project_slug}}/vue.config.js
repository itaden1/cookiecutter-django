
module.exports = {

    outputDir: '../../{{cookiecutter.project_slug}}/static/vue/dist',
    indexPath: '../../../../templates/vue/app.html',
    chainWebpack: config => {
        config
            .plugin("html")
            .tap(args => {
                if (process.env.DEV_TEMPLATE) {
                    args[0].template = "./public/dev.html"
                } else{
                    args[0].inject = false;
                    args[0].template = './public/index.html'
                }
                return args
            })
    }
}