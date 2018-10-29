import path from 'path';


export default (moduleOptions) => {

    const options = {
        ...moduleOptions
    };

    this.addTemplate({
        src: path.resolve(__dirname, 'templates/plugin.js')
    })
}
