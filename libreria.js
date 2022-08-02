//libreria para evitar repeticiones de codigo consultas ajax

class consultas {
    constructor() {
        this.consultas = [];
    }

    consultaAjax(url, datos, funcion) {
        var consulta = {
            url: url,
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

    ejecutarConsultas() {
        var self = this;
        if (this.consultas.length > 0) {
            var consulta = this.consultas.shift();
            $.ajax({
                url: consulta.url,
                data: consulta.datos,
                success: function (data) {
                    console.log(data);
                    consulta.funcion(data);
                    
                    self.ejecutarConsultas();
                }
            });
        }
    }

    run() {
        this.ejecutarConsultas();
    }
}

var result = new consultas();

//Agrega una consulta a la cola de consultas
function agregarConsulta(url, datos, funcion) {
    result.consultaAjax(url, datos, funcion);
}

console.log(result.mostrarColaConsultas());



/* consultas.ajaxconsulta({url: 'https://reqbin.com/echo/post/json', method: 'GET', data: {}, success: function (data) {
    console.log(data);
}, error: function (error) {}}); */

agregarConsulta('https://httpbin.org/get', {}, function (data) {});

console.log(result.mostrarColaConsultas());

result.run();