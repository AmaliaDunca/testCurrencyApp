<template>
  <div>
    <highchart :options="chartOptions" />
    <div class="search-table">
      <div class="form-outline">
  <input v-model="currencyValue"
      @keydown.enter="search(currencyValue)" type="search" id="form1" class="form-control" placeholder="Type query" aria-label="Search" />
</div>
    </div>
    <div style="margin-top100px"> 
      <table class="table">
  <thead>
    <tr>
      <th scope="col">USD</th>
      <th scope="col">Euro</th>
      <th scope="col">Pounds</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(value,index) in allCurencys" :key="index">

      <th v-for="(el, index) in value" :key='index' scope="row">
          
       <td>{{el}}</td>
      </th>
    </tr> 
    
  </tbody>
</table>
      <!-- <b-table striped hover :items="items" :fields="fields"></b-table> -->
      </div>
   
  </div>
</template>

<script>
import SocketIO from "socket.io-client";
import { Chart } from "highcharts-vue";


export default {
  name: "App",
  components: {
    highchart: Chart,
  },
  data() {
    return {
      socket: null,
      usd: [],
      euro: [],
      pounds: [],
      //table
      allCurencys:[],
      currencyValue:null,
      //chart
      chartType: "Column",
      seriesColor: "#6fcd98",
      colorInputIsSupported: null,
      chartOptions: {
        xAxis: {
          categories: ["USD", "EUR", " GBP"],
          tickInterval: 1,
          labels: {
            enabled: true,
          },
        },
        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: " {value} $",
              style: {
                color: "#FF5733",
              },
            },
            title: {
              text: "USD",
              style: {
                color: "#FF5733",
              },
            },
            opposite: true,
          },
          {
            // Secondary yAxis
            gridLineWidth: 0,
            title: {
              text: "Euro",
              style: {
                color: "#A533FF",
              },
            },
            labels: {
              format: "{value} euro",
              style: {
                color: "#A533FF",
              },
            },
          },
          {
            // Tertiary yAxis
            gridLineWidth: 0,
            title: {
              text: "Pounds",
              style: {
                color: "#55FF33",
              },
            },
            labels: {
              format: "{value} £",
              style: {
                color: "#55FF33",
              },
            },
            opposite: true,
          },
        ],
        chart: {
          type: "spline",
        },
        title: {
          text: "Spline chart",
        },
        series: [
          {
            name: "USD",
            yAxis: 1,
            data: this.usd,
            tooltip: {
              valueSuffix: " $",
            },
          },
          {
            name: "Euro",
            yAxis: 2,
            data: 
              this.euro
            ,
            marker: {
              enabled: false,
            },
            dashStyle: "shortdot",
            tooltip: {
              valueSuffix: " euro",
            },
          },
          {
            name: "Pounds",
            data: 
              this.pounds
            ,
            tooltip: {
              valueSuffix: " £ ",
            },
          },
        ],
      },
    };
  },
  methods: {
    search(arg){
        console.log( this.allCurencys[0][0].toString().includes(arg.toString()))

      }
 
  },
  async created() {
    const socketProtocol =
      window.location.protocol === "https:" ? "wss:" : "ws:";
    const port = ":3000";
    const socketURL = socketProtocol + "//" + window.location.hostname + port;
    this.socket = await SocketIO(socketURL);
    // this.socket = await SocketIO('ws://localhost:3000');

    this.socket.on("message", (usd, euro, pounds) => {
      
      this.usd.push(usd);
      this.euro.push(euro);
      this.pounds.push(pounds);

      this.chartOptions.series[0].data = this.usd
      this.chartOptions.series[1].data = this.euro
      this.chartOptions.series[2].data = this.pounds
      //  if(this.allCurencys.length !== 0){
      //    [...this.allCurencys].forEach(element => {
      //      element.forEach(i =>{
      //        console.log(i)
      //         if(i !== usd  ){
      //             return 
      //      }
      //      })
      //     //  if( element !== usd ){

      //     //  }
      //    });
      //   //  this.allCurencys.push([...this.usd,...this.euro,...this.pounds])
      //  }else{
         this.allCurencys.push([usd, euro , pounds])
         
      //  }
      // this.allCurencys = [ usd, euro, pounds]
      console.log(this.allCurencys)
      // console.log(usd, "usd");
      // console.log(euro, "euro");
      // console.log(pounds, "pound");
    });
  },
};
</script>

<style>
.search-table{
  margin-top:100px;
}
</style>
