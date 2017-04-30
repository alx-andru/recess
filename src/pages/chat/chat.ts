import {Component, ElementRef, Renderer, ViewChild} from '@angular/core';
import {Content, NavController, Platform} from 'ionic-angular';
import {Badge, Keyboard} from 'ionic-native';
import {AngularFire} from 'angularfire2';
import {DataService} from '../../providers/data.service';
import * as moment from 'moment';
import {BasePage} from '../base/base';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',

})
export class ChatPage extends BasePage {
  uid: any;
  alias: any;
  tabBarElement: any;
  messages: any[];

  messagesRef: any;

  sectionHeight: any;
  keyboardHeight: any;
  viewHeight: any;
  footerHeight: any;

  @ViewChild(Content) content: Content;
  @ViewChild('newMessage') textArea: ElementRef;
  @ViewChild('msg') messagesView: ElementRef;
  @ViewChild('ftr') footerView: ElementRef;


  constructor(public platform: Platform,
              public navCtrl: NavController,
              public data: DataService,
              public af: AngularFire,
              private rd: Renderer, public plt: Platform) {

    super(data);

    let self = this;

    this.data.initPush();
    this.platform = platform;
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');


    this.data.getChat().then(chat => {
      //console.log(chat.talkTo);
      this.messagesRef = this.af.database.list(`/user/${chat.talkTo}/conversation`);

      this.messagesRef.subscribe(messages => {
        //console.log('new messages');
        this.messages = messages;
        Badge.clear();
        this.data.setUnreadMessages(0);

        this.toBottom();
      });

    });


    this.data.getUser().then(userInfo => {
      //console.log(userInfo);
      this.uid = userInfo.uid;
      this.alias = userInfo.alias;
    });

    Keyboard.onKeyboardShow().subscribe(data => {
      //console.log(`keyboard is shown ${data}`);
      //your code goes here


      this.sectionHeight = this.viewHeight - data.keyboardHeight;
      //console.log(`viewheight: ${this.sectionHeight}`);
      //console.log(`footerheight: ${this.footerHeight}`);
      // height of messagebox =
      if (this.plt.is('ios')) {
        this.messagesView.nativeElement.style.height = `${this.viewHeight - data.keyboardHeight - this.footerHeight - 20}px`;
        this.footerView.nativeElement.style.bottom = `${data.keyboardHeight}px`;
      }


      this.toBottom();
    });

    Keyboard.onKeyboardHide().subscribe(data => {
      console.log('keyboard is hidden');
      //your code goes here
      this.sectionHeight = '100%';
      this.messagesView.nativeElement.style.height = '100%';
      //this.footerView.nativeElement.style.bottom = `400px !important`;
      this.footerView.nativeElement.style.bottom = '0';
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.toBottom();
    this.viewHeight = this.messagesView.nativeElement.offsetHeight;
    this.footerHeight = this.footerView.nativeElement.offsetHeight;
  }


  ngOnInit() {
    this.data.refreshPush();
  }

  ngAfterViewInit() {

    // this returns null
  }

  toBottom() {
    console.log('toBottom');
    const self = this;
    setTimeout(function () {
      console.log('New height: ' + self.messagesView.nativeElement.scrollHeight);
      self.messagesView.nativeElement.scrollTop = self.messagesView.nativeElement.scrollHeight + 5;
      self.data.setUnreadMessages(0);
    }, 1000);

  }


  inputUp() {

  }

  inputDown() {
    Keyboard.close();
  }

  sendMessage(msg) {

    if (msg.value === undefined || msg.value === null || msg.value.length === 0) {
      return;
    } else {

      const message = {
        text: msg.value,
        timestamp: moment().valueOf(),
        author: this.uid,
        alias: this.alias || 'user',
        type: 'user'
      };

      this.messagesRef.push(message);
      msg.setFocus();
      msg.value = null;

      this.data.setEvent('message', 'message_send', 'chat');

      this.toBottom();
    }

  }

  goBack() {
    this.navCtrl.parent.select(1);
  }

  ionViewDidEnter() {
    this.tabBarElement.style.display = 'none';
    this.data.setUnreadMessages(0);

    this.toBottom();

  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  preventFocusChange(e) {
    e.preventDefault();
  }


}
