<template>
  <div>
    <div style="width:1000px"/>
    <!--I need text to align the page right and I don't understand why but it works I need text to align the page right and I don't understand why-->
    <div class="fixed top-0 bottom-0 w-full h-full text-left">
      Hover on a marker to compare the different languages. The thicker the lines between them, the more comparative the two connected languages are. 
      Click on markers and lines for more information.
      <GmapMap class="mt-2 flex-auto" style="width: 1500px; height: 900px;" :center="{ 'lat': 53.5, 'lng': 14.554034653100416 }" :zoom="4.5"
        @click.self="clickLanguage(null)" ref="map">
        <div v-for="(language, index) in locations" :key="index">
          <GmapMarker v-if="checked.includes(language.name)" :position="language.location" :label="language.name" @click="clickLanguage(language)" v-on:mouseover="hoveronMarker(language)" v-on:mouseout="mouseLeaveMarker(language)"/>
          <div v-if="language.draw">
            <div v-for="(to, index2) in locations" :key="index2">
              <GmapPolyline v-if="checked.includes(to.name)" :path="[language.location, to.location]" :label="printScore(to)" :options="setWidth(language, to, index2)" @click="clickLanguage(to)"  v-on:mouseover="hoveronLine(to)" v-on:mouseout="mouseLeaveMarker(to)"/>
            </div>
          </div>
        </div>
        <div slot="visible">
          <div v-if="clicked" class="absolute bottom-0 left-0 bg-white text-black z-100 px-2">
            {{infoText}}
          </div>
        </div>
        <div slot="visible">
          <div class="absolute flex flex-col right-0 h-full text-black z-100 text-left">
            <div class="bg-white text-left border-b-2 border-black pl-2">
              <span class="font-bold"> Languages to show:</span> <br>
              <input
              id="Select all"
              v-model="allSelected"
              class="left-0 mx-4"
              type="checkbox"
              @click="selectAll()"
            /> (De)select all
            </div>
            <div class="max-h-1/4 overflow-y-auto bg-white pl-2">
              <div v-for="(language, index) in locations" :key="index">
                <input
                  v-model="checked"
                  type="checkbox"
                  :value="language.name"
                />
                {{language.name}}
              </div>
            </div>
          </div>
        </div>
      </GmapMap>
    </div>
  </div>

</template>



<script>

import {range} from 'lodash'
import location_data from '~/static/locations.json'
import distances_data from '~/static/clean_distances.json'

export default {
  head() {
    return {
      title: "HCI project"
    };
  },
  data () {

    return {
      locations: location_data,
      distances: eval(distances_data),
      fromScores: [],
      clicked: false,
      cur_language: null,
      infoText: '',
      checked: [],
      allSelected: true
      
    }

  },
  mounted () {
    for (const language of this.locations) {
        if (!this.checked.includes(language.name))
          this.checked.push(language.name)
      }
  },
  methods: {
    selectAll() {
      if (!this.allSelected) {
        for (const language of this.locations) {
          if (!this.checked.includes(language.name))
            this.checked.push(language.name)
        }
      }
      else 
        this.checked = []
      this.allSelected = !this.allSelected
    },
    hoveronMarker(language) 
    {
      if (!this.clicked) 
      {
        language.draw = true;
        this.cur_language = language;
      }
      else if (this.cur_language != null && language.name != this.cur_language.name) 
      {
        this.infoText = 'Score between ' + this.cur_language.name + " and " + language.name + ': ' + ((100 - this.distances[this.cur_language.name][language.name]).toFixed(2)).toString();
      }
    },
    hoveronLine(language)
    {
      if(this.clicked && this.cur_language != null)
      {
        this.infoText = 'Score between ' + this.cur_language.name + " and " + language.name + ': ' + ((100 - this.distances[this.cur_language.name][language.name]).toFixed(2)).toString();
      }
    },
    mouseLeaveMarker(language)
    {
      if (!this.clicked) 
      {
       language.draw = false;
       this.cur_language = null;
      }
      this.infoText = "";
    },
    setWidth(from, to, index) 
    {
      console.log("fromScores is klaar")
      const distance = this.distances[from.name][to.name];
      const score = (100 - distance) / 7;
      let output = { "strokeWeight": score, "strokeOpacity": 0.6 };
      if (this.clicked) {
        output.strokeColor = '#FF0000';
      }
      console.log(output);
      return output;
    },
    showDetails(language1, language2)
    {
      const distance = this.distances[language1.name][language2.name]
      const related = this.getRelatedness(distance)
      alert('The comparative score between ' + language1.name + ' and ' + language2.name + ' is ' + (100 - distance) + '\n'
        + 'This means they have a genetical distance of ' + distance + '\n'
        + 'These languages are ' + related.related + '\n'
        + 'They have probably ' + related.protolanguage + '\n'
        + 'For more information, see http://www.elinguistics.net/Compare_Languages.aspx')
    },
    clickLanguage(language) {
      if (this.cur_language == null)
        return;
      if (this.clicked) 
      {
        if (language == null) {
          this.clicked = false;
          this.cur_language.draw = false;
          this.cur_language = null;
          return;
        }
        else if (language.name == this.cur_language.name) {
          this.clicked = false;
          language.draw = false;
          return;
        }
        this.showDetails(this.cur_language, language)
      }
      else if (language != null)
      {
        this.clicked = true;
      }
    },
    printScore(language) {
      if (this.cur_language == null || language.name == this.cur_language.name) {
        return ""
      }
      console.log("printing " + language.name + " and " + this.cur_language.name);
      return this.distances[this.cur_language.name][language.name].toString()
    },
    getRelatedness(distance) {
      let output = {}
      if (distance < 30) {
        output.related = "highly related"
        output.protolanguage = "a protolanguage between several centuries and approximatly 2000 years old"
      }
      else if (distance < 50) {
        output.related = "related"
        output.protolanguage = " a protolanguage between approximately 2000 and 4000 years old"
      }
      else if (distance < 70) {
        output.related = "remotely related"
        output.protolanguage = "a protolanguage between approximately 4000 and 6000 years old"
      }
      else if (distance < 78) {
        output.related = "very remotely related"
        output.protolanguage = "a protolanguage older than approximately 6000 years, but there is a high potential of interference with chance ressemblance old"
      }
      else {
        output.related = "not recognizably related"
        output.protolanguage = "no common protolanguage. The few resemblances measured are more likely to be due to chance than to common origin"
      }
      return output
    }
  }

  /*
  for (languages in locations) {
    drawline(current.location, )
  }
  */

}

</script>
