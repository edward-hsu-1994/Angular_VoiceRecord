import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import swal from 'sweetalert2';

/**
 * MediaRecorder 類別定義
 */
declare class MediaRecorder {
  constructor(stream: MediaStream);
  ondataavailable;
  onerror;
  onpause;
  onresume;
  onstart;
  onstop;

  start();
  stop();
  puase();
  isTypeSupported();
  requestData();
  resume();
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  status = false; // 裝置存取狀態
  stream: MediaStream;
  recorder: MediaRecorder;
  buffer: Blob;

  @ViewChild('player') player: ElementRef;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    navigator.getUserMedia({ // 向用戶取得媒體裝置存取
      audio: true, // 僅存取音訊裝置
      video: false
    }, (stream: MediaStream) => {
      this.status = true; // 重設狀態為已經取得媒體存取權限
      this.stream = stream;
      this.cdr.detectChanges(); // 引動變數異動檢查
    }, () => {
      // 提示無法取得權限錯誤訊息
      swal('沒有權限', '無法取得音訊裝置存取權限', 'error');
    });
  }

  /**
   * 開始錄音
   */
  startRecord() {
    // 建立錄製器
    this.recorder = new MediaRecorder(this.stream);

    // 開始錄製
    this.recorder.start();

    // 當錄製資料準備完成，寫入緩衝
    this.recorder.ondataavailable = (e) => {
      this.buffer = e.data;
    };

    this.recorder.onstop = () => {
      // 建立URL物件
      const audioURL = URL.createObjectURL(this.buffer);

      // 設定Audio Source
      (this.player.nativeElement as HTMLSourceElement).src = audioURL;

      // 調用父元素load
      ((this.player.nativeElement as HTMLSourceElement).parentElement as any).load();

      this.recorder = null;

      this.cdr.detectChanges(); // 引動變數異動檢查
    };

    this.cdr.detectChanges(); // 引動變數異動檢查
  }

  /**
   * 結束錄音
   */
  endRecord() {
    // 防呆
    if (this.recorder === null) {
      return;
    }

    // 停止錄製
    this.recorder.stop();
  }




}
