//libreria para evitar repeticiones de codigo consultas ajax
class consultas {
    constructor() {
        this.consultas = [];
    }

    consultaAjax(url, method, datos, funcion) {
        var consulta = {
            url: url,
            method: method,
            datos: datos,
            funcion: funcion
        }
        this.consultas.push(consulta);
    }

    mostrarColaConsultas() {
        if (this.consultas.length === 0) {
            console.log("No hay consultas");
            return 0;
        }

        console.log(this.consultas);
    }

    async ejecutarConsultas() {
        var self = this;
        if (this.consultas.length > 0) {
            var consulta = this.consultas.shift();
            try {
                await $.ajax({
                    url: consulta.url,
                    method: consulta.method,
                    data: consulta.datos,
                    success: function (data) {
                        consulta.funcion(data);
                    },
                    error: function (error) {
                        consulta.funcion(error.statusText + " " + error.status);
                    },
                    complete: function () {
                       self.ejecutarConsultas();
                    }
                });
            } catch (e) {
               self.ejecutarConsultas();
            }
        }
    }

    async run() {
        await this.ejecutarConsultas();
    }
}

var result = new consultas();
var array = [];

//Agrega una consulta a la cola de consultas
function agregarConsulta(url, method, datos, funcion) {
    result.consultaAjax(url, method, datos, funcion);
}

function callback(data) {
    array.push(data);
}

//Agrega consultas a la cola de consultas
agregarConsulta('https://httpbin.org/get', "GET", {}, callback);
agregarConsulta('https://jsonplaceholder.typicode.com/todos/1', "GET", {}, callback);
agregarConsulta('https://dummyjson.com/products/1', "GET", {}, callback);

result.run().finally(function () {
    console.log(array);
});