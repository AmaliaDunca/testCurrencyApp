<template>
  <div>
    <highchart :options="chartOptions" />
    <div class="search-table">
      <div class="form-outline">
  <input v-model="currencyValue"
      type="search" id="form1" class="form-control" placeholder="Type query" aria-label="Search" />
</div>
    </div>
    <div style="margin-top100px"> 
      <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th v-if="!sortUsd" @click="sortNumbersUsd()" scope="col">USD</th>
      <th v-if="sortUsd" @click="sortNumbersUsd()" scope="col">USD - sorted</th>

      <th scope="col">Euro</th>
      <th scope="col">Pounds</th>

    </tr>
  </thead>
  <tbody>
     <tr >
        <th>Avrige</th>
      <th scope="row">
       <td>{{getAvrigeNumber(usd)}}</td>
      </th>
      <th scope="row">
         <td>{{getAvrigeNumber(euro)}}</td>
      </th>
       <th scope="row">
         <td>{{getAvrigeNumber(pounds)}}</td>
      </th>
    </tr> 
 <tr >
        <th>Median</th>
      <th scope="row">
       <td>{{getMedianNumber(usd)}}</td>
      </th>
      <th scope="row">
         <td>{{getMedianNumber(euro)}}</td>
      </th>
       <th scope="row">
         <td>{{getMedianNumber(pounds)}}</td>
      </th>
    </tr> 
    <tr v-for="(value,index) in filteredList" :key="index">
        <th>{{index}}</th>
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
      sortUsd:false,
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
  sortNumbersUsd(){
    this.sortUsd = !this.sortUsd
  },
  sumNumber(array) {
  var total = 0;
  for (var i=0; i<array.length; i++) {
    total += array[i];
      }
  return total;
  },

   getAvrigeNumber (array) {
      var arraySum = this.sumNumber(array);
      return arraySum / array.length;
    },

   getMedianNumber (array){
      array = array.sort();
  if (array.length % 2 === 0) { // array with even number elements
    return (array[array.length/2] + array[(array.length / 2) - 1]) / 2;
  }
  else {
    return array[(array.length - 1) / 2]; // array with odd number elements
  }
  
    }
 
  },
  computed:{
    filteredList(){
      // if(this.sortUsd){
      //  console.log((JSON.parse(JSON.stringify(this.usd))).sort())
      //    return [  [(JSON.parse(JSON.stringify(this.usd))).sort(), this.euro, this.pounds]]
        
      // }
      // if (!this.sortUsd) {
      //    return this.allCurencys
      // }
      if(!this.currencyValue){
        return this.allCurencys
      }
      else{
         return this.allCurencys.filter(ele => {
           if(
             ele[0].toString().includes(this.currencyValue.toString()) || 
             ele[1].toString().includes(this.currencyValue.toString()) || 
             ele[2].toString().includes(this.currencyValue.toString())){
               return true
           }
         // all numbers is a row must iclude the search
        // ele.forEach(num =>{
        //  return num.toString().includes(this.currencyValue.toString())
        // })
      });
    }
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
      
      this.usd.push( usd);
      this.euro.push(euro);
      this.pounds.push(pounds);
      // console.log(this.usd)

      this.chartOptions.series[0].data = this.usd
      this.chartOptions.series[1].data = this.euro
      this.chartOptions.series[2].data = this.pounds
     
      this.allCurencys.push([usd, euro , pounds])
   
      // console.log(this.allCurencys)
  
    });
  },
};
</script>

<style>
.search-table{
  margin-top:100px;
}
.table td, .table th {
    vertical-align: baseline !important;
     }
</style>
