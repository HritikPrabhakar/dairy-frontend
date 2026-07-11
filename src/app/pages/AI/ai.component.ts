import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `

<div class="page">

  <h2>🤖 Dairy AI Assistant</h2>

  <!-- Sales Prediction -->

  <div class="card">

    <h3>📈 Sales Prediction</h3>

    <button (click)="getSalesPrediction()">
      Generate
    </button>

    <pre *ngIf="sales">{{ sales | json }}</pre>

  </div>

  <!-- Customer Insights -->

  <div class="card">

    <h3>👥 Customer Insights</h3>

    <button (click)="getCustomerInsights()">
      Generate
    </button>

    <pre *ngIf="customers">{{ customers | json }}</pre>

  </div>

  <!-- Bill Reminder -->

  <div class="card">

    <h3>💰 Bill Reminder</h3>

    <input
      type="number"
      placeholder="Enter Bill Id"
      [(ngModel)]="billId">

    <button (click)="getBillReminder()">
      Generate Reminder
    </button>

    <pre *ngIf="reminder">{{ reminder | json }}</pre>

  </div>

  <!-- Voice Sale -->

  <div class="card">

    <h3>🎤 Voice Sale</h3>

    <div class="mode">

      <label>

        <input
          type="radio"
          name="mode"
          [(ngModel)]="mode"
          value="manual">

        Manual

      </label>

      <label>

        <input
          type="radio"
          name="mode"
          [(ngModel)]="mode"
          value="voice">

        Voice

      </label>

    </div>

    <!-- Manual -->

    <div *ngIf="mode=='manual'">

      <textarea
        rows="5"
        [(ngModel)]="voiceText"
        placeholder="Example:
Ramesh bought 2 litre milk and 1 kg curd paid cash">
      </textarea>

    </div>

    <!-- Voice -->

    <div *ngIf="mode=='voice'">

      <button
        class="mic-btn"
        (click)="startListening()">

        {{ isListening ? '🎙 Listening...' : '🎤 Start Speaking' }}

      </button>

      <textarea
        rows="5"
        [(ngModel)]="voiceText"
        placeholder="Recognized speech will appear here...">
      </textarea>

    </div>

    <button
      class="convert-btn"
      (click)="convertVoiceSale()">

      Convert

    </button>

    <pre *ngIf="voiceResult">{{ voiceResult | json }}</pre>

  </div>

</div>

`,

  styles: [`

.page{
  max-width:900px;
  margin:auto;
  padding:25px;
}

.card{
  background:#fff;
  padding:20px;
  border-radius:12px;
  margin-bottom:25px;
  box-shadow:0 2px 10px rgba(0,0,0,.08);
}

button{
  padding:10px 18px;
  background:#2563eb;
  color:#fff;
  border:none;
  border-radius:8px;
  cursor:pointer;
  margin-top:12px;
}

button:hover{
  background:#1d4ed8;
}

input[type="number"],
textarea{
  width:100%;
  padding:12px;
  border:1px solid #ddd;
  border-radius:8px;
  margin-top:10px;
  box-sizing:border-box;
}

.mode{
  display:flex;
  gap:20px;
  margin:15px 0;
}

.mode label{
  cursor:pointer;
  font-weight:600;
}

.mode input{
  width:auto;
  margin-right:6px;
}

.mic-btn{
  background:#16a34a;
}

.mic-btn:hover{
  background:#15803d;
}

.convert-btn{
  margin-top:15px;
}

pre{
  background:#f4f4f4;
  padding:15px;
  border-radius:10px;
  margin-top:15px;
  overflow:auto;
}

`]

})
export class AIComponent {

  private ai = inject(AIService);

  sales: any;
  customers: any;
  reminder: any;
  voiceResult: any;

  billId = 0;

  mode = 'manual';
  voiceText = '';

  recognition: any;
  isListening = false;

  constructor() {

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {

      this.recognition = new SpeechRecognition();

      this.recognition.lang = 'en-IN';

      this.recognition.continuous = false;

      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {

        this.voiceText = event.results[0][0].transcript;

      };

      this.recognition.onend = () => {

        this.isListening = false;

      };

    }

  }

  startListening() {

    if (!this.recognition) {

      alert('Speech Recognition is not supported in this browser.');

      return;

    }

    this.voiceText = '';

    this.isListening = true;

    this.recognition.start();

  }

  getSalesPrediction() {

    this.ai.salesPrediction().subscribe(res => {

      this.sales = res;

    });

  }

  getCustomerInsights() {

    this.ai.customerInsights().subscribe(res => {

      this.customers = res;

    });

  }

  getBillReminder() {

    if (!this.billId) {

      alert('Enter Bill Id');

      return;

    }

    this.ai.billReminder(this.billId).subscribe(res => {

      this.reminder = res;

    });

  }

  convertVoiceSale() {

    if (!this.voiceText.trim()) {

      alert('Enter or Speak something first.');

      return;

    }

    this.ai.voiceSale(this.voiceText).subscribe(res => {

      this.voiceResult = res;

    });

  }

}