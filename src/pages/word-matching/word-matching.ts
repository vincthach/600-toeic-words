import {
  Component, trigger,
  style,
  transition,
  animate, OnDestroy
} from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { NativeAudio } from '@ionic-native/native-audio';

import { Word } from '../../models/word';
import { QuestionGame } from '../../models/question-game';
import { Lesson } from '../../models/lesson';

@Component({
  selector: 'page-word-matching',
  templateUrl: 'word-matching.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateY(100%)', opacity: 0 }),
          animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateY(0)', opacity: 1 }),
          animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
        ])
      ]
    )
  ]
})

export class WordMatchingPage implements OnDestroy{
  
  ngOnDestroy(): void {
    this.nativeAudio.stop("backgroundMusic");
    this.nativeAudio.unload("backgroundMusic");
    this.nativeAudio.unload("correct");
    this.nativeAudio.unload("wrong");
  }

  // object connect to db
  public database: SQLite;
  // questions
  public questions: Array<QuestionGame>;
  // words list 
  public words: Array<Word>;

  selectedLesson: Lesson;

  time: number = 3;
  progressPercent = 100;
  isFlashLoading = true;
  isFalseOrTimeOut = true;
  istem = false;
  isCanTap = false;
  isRunTimer = false;
  isShowHeader = true;
  isEndGame = false;
  key: number = 1;
  selectedAnswer: number = 0;
  currentIndexQuestion: number = 0;
  lengthQuestion: number = 0;
  currentQuestion: QuestionGame;

  point: number = 0;
  life: number = 5;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public platform: Platform, private nativeAudio: NativeAudio) {
    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
    // create object sqlite
    this.database = new SQLite();
    // when platform ready-> open DB and load data from words table in db

    platform.ready().then(() => {
      this.database.openDatabase({
        name: 'toeic-voca.db',
        location: 'default'
      }).then((successed) => {
        this.loadWordsData(this.selectedLesson.lessonID);  // load data when open database succefully
        //

      }, (err) => {
        console.log("Error opening database: " + err);
        alert("Error opening database: " + err);
      });
    }
    );
  }

  preloadBackgroundMusic(){
    this.nativeAudio.preloadComplex("backgroundMusic","assets/audio/background-sound.mp3",1,1,0);
  }

  preloadCorrectWrongSound(){
    this.nativeAudio.preloadSimple("correct","assets/audio/correct-sound-effect.mp3");
    this.nativeAudio.preloadSimple("wrong","assets/audio/wrong-sound-effect.mp3");
  }

  playBackgroundMusic(){
    this.nativeAudio.loop("backgroundMusic");
  }

  playSoundCorrect(){
    this.nativeAudio.play("correct");
  }

  playSoundWrong(){
    this.nativeAudio.play("wrong");
  }

  ionViewDidLoad() {
   
    this.preloadBackgroundMusic();
    this.preloadCorrectWrongSound();
    var i = 0;
    var intervar = setInterval(() => {
      i = i + 1000;
      if (i > 2000) {
        clearInterval(intervar);
        console.log(this.questions[this.currentIndexQuestion]);
        this.currentQuestion = this.questions[this.currentIndexQuestion];
        this.isFalseOrTimeOut = false;
        this.isFlashLoading = false;
        this.isShowHeader = false;
        this.isRunTimer = true;
        this.nativeAudio.loop("backgroundMusic");
        this.runTimer();
      }
      this.time = this.time - 1;
    }, 1000);
  }

  runTimer() {
    var i = 0;
    var timer = setInterval(() => {
      i = i + 50;
      this.progressPercent = this.progressPercent - 1;
      if (this.selectedAnswer == this.currentQuestion.indexKey) {
        //change data
        i = 0;
        this.nativeAudio.play("correct");
        this.point++;
        this.currentIndexQuestion++;
        if (this.currentIndexQuestion == this.questions.length)
        {
          clearInterval(timer);
          this.setEnGame();
          return;
        }
        this.currentQuestion = this.questions[this.currentIndexQuestion];
        this.progressPercent = 100;
        this.selectedAnswer = 0;
      }
      if (this.selectedAnswer != this.currentQuestion.indexKey && this.selectedAnswer != 0) {
        clearInterval(timer);
        this.nativeAudio.play("wrong");
        this.life--;
        this.isFalseOrTimeOut = true;
        this.istem = true;
        this.isRunTimer = false;
        this.isCanTap = true;
        this.selectedAnswer = 0;
        this.currentIndexQuestion++;
      }
      if (i == 5000) {
        clearInterval(timer);
        this.nativeAudio.play("wrong");
        this.life--;
        this.isFalseOrTimeOut = true;
        this.istem = true;
        this.isRunTimer = false;
        this.isCanTap = true;
        this.currentIndexQuestion++;
      }
    }, 50);
  }
  choose(a) {
    if (!this.isCanTap){
      this.selectedAnswer = a;
      console.log(a);
    }
    
  }
  setEnGame(){ 
    this.isCanTap = false;
    this.lengthQuestion = this.questions.length;
    this.isFlashLoading = false;
    this.isShowHeader = true;
    this.isFalseOrTimeOut = true;
    this.istem = false;
    this.isRunTimer = false;
    this.isEndGame = true;
  }
  tapEvent(e) {
    if (this.isCanTap) {
      this.isCanTap = false;
      this.isRunTimer = true;
      this.progressPercent = 100;
      this.isFalseOrTimeOut = false;
      this.isFlashLoading = false;
      this.istem = false;
      if (this.currentIndexQuestion == this.questions.length || this.life == 0)
      {
        this.setEnGame();
        return;
      }
      this.currentQuestion = this.questions[this.currentIndexQuestion];
      this.runTimer();
    }
  }

  playAgain(){
    this.selectedAnswer = 0;
    this.isEndGame = false;
    this.currentIndexQuestion = 0;
    this.currentQuestion = this.questions[this.currentIndexQuestion];
    this.point = 0;
    this.life = 5;
    this.isCanTap = false;
    this.isShowHeader = false;
    this.isRunTimer = true;
    this.progressPercent = 100;
    this.isFalseOrTimeOut = false;
    this.isFlashLoading = false;
    this.istem = false;
    this.runTimer();
  }

  back(){

    this.navCtrl.pop();

  }

  // function load data
  private loadWordsData(lessonSelectedID) {
    // check if array lesson is empty
    if (!this.words) {
      // using loading controller to create loading icon while loading data
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      // display loading icon
      loading.present();
      // get data and push in to array this.lessons
      this.database.executeSql("SELECT * FROM words WHERE LessonID=" + lessonSelectedID, []).then((wordsData) => {
        this.words = [];
        // alert("words total: " + wordsData.rows.length);
        if (wordsData.rows.length > 0) {
          for (var i = 0; i < wordsData.rows.length; i++) {
            // temporary variable store one word
            let wordTemp: Word = {
              wordID: wordsData.rows.item(i).WordID,
              word: wordsData.rows.item(i).Word,
              type: wordsData.rows.item(i).Type,
              lessonID: wordsData.rows.item(i).LessonID,
              meaning: wordsData.rows.item(i).Meaning,
              favorite: wordsData.rows.item(i).Favorite,
              phienAm: wordsData.rows.item(i).PhienAm,
              linkImg: wordsData.rows.item(i).linkImage,
              linkAudio: wordsData.rows.item(i).linkAudio,
              examples: [],
              families: []
            }
            // Push word completed to array words
            this.words.push(wordTemp);
          } // end for loop get words
          loading.dismiss(); // disappear icon loading when done
          this.createListQuestions();
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
  } // end function getWordsData

  private createListQuestions() {
    this.questions = [];
    for (var i = 0; i < this.words.length; i++) {
      let currentIndex = i;
      let indexWord1 = currentIndex;
      let indexWord2;
      let indexWord3;

      while (indexWord1 == currentIndex) {
        indexWord1 = this.createRandomNumber(0, 11);
      }

      indexWord2 = indexWord1;
      while (indexWord2 == currentIndex || indexWord2 == indexWord1) {
        indexWord2 = this.createRandomNumber(0, 11);
      }

      indexWord3 = indexWord2;
      while (indexWord3 == currentIndex || indexWord3 == indexWord1 || indexWord3 == indexWord2) {
        indexWord3 = this.createRandomNumber(0, 11);
      }

      let question: QuestionGame = {
        keyword: this.words[currentIndex],
        word1: this.words[indexWord1],
        word2: this.words[indexWord2],
        word3: this.words[indexWord3],
        indexKey: currentIndex
      };

      let answer = this.createRandomNumber(1, 3);;
      switch (answer) {
        case 1:
          question.word1 = question.keyword; question.indexKey = 1; break;
        case 2:
          question.word2 = question.keyword; question.indexKey = 2; break;
        case 3:
          question.word3 = question.keyword; question.indexKey = 3; break;
      }

      this.questions.push(question);
    }
  }

  private createRandomNumber(min, max): number {
    return Math.floor(Math.random() * ((max - min) + 1) + min);
  }
}


