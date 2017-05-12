import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { Lesson } from '../../models/lesson';
import { Part5 } from '../../models/part5';

import { SQLite } from 'ionic-native';


@Component({
  selector: 'page-practice-part5',
  templateUrl: 'practice-part5.html'
})
export class PracticePart5 {

  public database: SQLite;
  public part5QuestionsArray: Array<Part5>; // 6 questions part5
  selectedLesson: Lesson;
  length: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform) {
    // get selectedLesson
    this.selectedLesson = navParams.data;
     this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db
    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadPart5Data(this.selectedLesson.lessonID);  // load data when open database succefully
      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  } // end constructor

  choose(){
    
  }

  // load part5 data
  loadPart5Data(lessonSelectedID) {
    // check if array question part5 is empty
    if (!this.part5QuestionsArray) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array 
      this.database.executeSql("SELECT * FROM part5s WHERE LessonID=" + lessonSelectedID, []).then((part5s) => {
        this.part5QuestionsArray = [];
        if (part5s.rows.length > 0) {
         
          this.length = part5s.rows.length;
          for (var i = 0; i < part5s.rows.length; i++) {
            // temporary variable store one question in part4
            let question: Part5 = {
              ID: part5s.rows.item(i).ID,
              LessonID: part5s.rows.item(i).LessonID,
              Question: part5s.rows.item(i).Question,
              Answer: part5s.rows.item(i).Answer,
              A: part5s.rows.item(i).A,
              B: part5s.rows.item(i).B,
              C: part5s.rows.item(i).C,
              D: part5s.rows.item(i).D,
              cssKeyA: '',
              cssKeyB: '',
              cssKeyC: '',
              cssKeyD: '',
              keyChoose: ''
            }
            this.part5QuestionsArray.push(question);
          } // end for loop get question in part5
          loading.dismiss(); // disappear icon loading when done
        }
        else { // when data is empty
          loading.dismiss(); // disappear icon loading when done
        }
      }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
        alert("error: " + error);
        loading.dismiss(); // disappear icon loading even if error
      });
    }
  } // end load Part5Data

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticePart5Page');
  }

}
