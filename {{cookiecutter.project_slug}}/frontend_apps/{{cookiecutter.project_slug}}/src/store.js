const axios = require('axios');
const apiBaseRoute = process.env.VUE_APP_API_ROUTE;

const store = {
    debug : true,
    state: {
        title: "{{cookiecutter.project_slug}}",
        data: [
            "this is some generic data",
            "some other data"
        ]
    },
    // ---- Define actions here ---- //
    genericAction(){
        alert("button pressed");
    },
}


export default store