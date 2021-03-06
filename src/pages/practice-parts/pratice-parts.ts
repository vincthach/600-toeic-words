import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Lesson } from '../../models/lesson';

import { PracticePart1 } from '../practice-part1/practice-part1';
import { PracticePart2 } from '../practice-part2/practice-part2';
import { PracticePart3 } from '../practice-part3/practice-part3';
import { PracticePart4 } from '../practice-part4/practice-part4';
import { PracticePart5 } from '../practice-part5/practice-part5';
import { PracticePart6 } from '../practice-part6/practice-part6';
import { PracticePart7 } from '../practice-part7/practice-part7';
import { WordsInContext } from '../words-in-context/words-in-context';

@Component({
  selector: 'page-pratice-parts',
  templateUrl: 'practice-parts.html',
})
export class PracticeParts {

  selectedLesson: Lesson;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // get selected lesson from homePage
    this.selectedLesson = navParams.data;
  }

  goToWordsInContextPage(){
    this.navCtrl.parent.parent.push(WordsInContext, this.selectedLesson);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PraticeParts');
  }

  goToPartDetail(whichPart) {
    switch (whichPart) {
      case 1: this.navCtrl.parent.parent.push(PracticePart1, this.selectedLesson); break;
      case 2: this.navCtrl.parent.parent.push(PracticePart2, this.selectedLesson); break;
      case 3: this.navCtrl.parent.parent.push(PracticePart3, this.selectedLesson); break;
      case 4: this.navCtrl.parent.parent.push(PracticePart4, this.selectedLesson); break;
      case 5: this.navCtrl.parent.parent.push(PracticePart5, this.selectedLesson); break;
      case 6: this.navCtrl.parent.parent.push(PracticePart6, this.selectedLesson); break;
      case 7: this.navCtrl.parent.parent.push(PracticePart7, this.selectedLesson); break;
      default:
        alert("No corrected part selected!");
    }
  }
}
