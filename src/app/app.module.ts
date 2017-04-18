import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LessonTabs } from '../pages/lesson-tabs/lesson-tabs';
import { WordsList } from '../pages/words-list/words-list';
import { PracticeParts } from '../pages/practice-parts/pratice-parts';
import { GamesList } from '../pages/games-list/games-list';

import { WordsDetail } from '../pages/words-detail/words-detail';
import { PracticePart1 } from '../pages/practice-part1/practice-part1';
import { GameWordFill} from '../pages/game-word-fill/game-word-fill';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LessonTabs,
    WordsList,
    PracticeParts,
    GamesList,
    WordsDetail,
    PracticePart1,
    GameWordFill
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LessonTabs,
    WordsList,
    PracticeParts,
    GamesList,
    WordsDetail,
    PracticePart1,
    GameWordFill
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}