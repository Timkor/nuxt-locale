import path from 'path';


export default (moduleOptions) => {

    const options = {
        ...moduleOptions
    };

    console.log(Object.keys(this))

    this.addPlugin({
        src: path.resolve(__dirname, 'templates/plugin.js'),
        fileName: path.join('nuxt-locale', 'plugin.js'),
        options: options
    })
}
