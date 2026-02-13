import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';

type CategoryOption = {
    label: string;
    value: string;
  };

@Component({
  standalone: true,
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonInput,
    IonTextarea,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ]
})

  

export class CreateEventPage {

  loading = false;

  categories: CategoryOption[] = [
  { label: 'Tecnologia', value: 'TECNOLOGIA' },
  { label: 'Negócios', value: 'NEGOCIOS' },
  { label: 'Educação', value: 'EDUCACAO' },
  { label: 'Saúde', value: 'SAUDE' },
  { label: 'Entretenimento', value: 'ENTRETENIMENTO' },
  { label: 'Outros', value: 'OUTROS' },
];



  // ✅ FORM TIPADO E ESCALÁVEL
  form = this.fb.nonNullable.group({

    title: ['', Validators.required],
    description: ['', Validators.required],
    imageUrl: [''],

    startDate: ['', Validators.required],
    endDate: [''],

    // endereço separado
    street: ['', Validators.required],
    number: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],

    category: ['', Validators.required],
    maxCapacity: [10, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private eventsSvc: EventsService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  // ================================
  // UTIL
  // ================================
  private parseDate(date: string | null) {
    if (!date) return undefined;

    const [d,m,y] = date.split('/');
    return new Date(+y, +m - 1, +d).toISOString();
  }

  async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Sucesso 🎉',
      message: 'Evento criado com sucesso!',
      buttons: ['OK']
    });

    await alert.present();
  }


  // ================================
  // SUBMIT
  // ================================
  create() {

    if (this.form.invalid || this.loading) return;

    this.loading = true;

    const v = this.form.getRawValue();

    // 🔥 PAYLOAD LIMPO
    const payload = {
      title: v.title,
      description: v.description,
      imageUrl: v.imageUrl,

      startDate: this.parseDate(v.startDate)!,
      endDate: this.parseDate(v.endDate) ?? this.parseDate(v.startDate)!,

      location: `${v.street}, ${v.number} - ${v.city}/${v.state}`,
      city: v.city,
      category: v.category,
      maxCapacity: v.maxCapacity
    };


    this.eventsSvc.create(payload).subscribe({
      next: async () => {
        this.loading = false;

        // 🔥 Mostrar popup
        await this.showSuccessAlert();

        // 🔥 Limpar formulário
        this.form.reset({
          maxCapacity: 10 // mantém valor padrão
        });

        this.preview = null;
        this.selectedFile = undefined as any;
      },
      error: err => {
        console.error('Erro criando evento', err);
        this.loading = false;
      }
    });
  }

  preview: string | ArrayBuffer | null = null;
  selectedFile!: File;

  // Upload normal
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.showPreview(file);
  }

  // Colar imagem
  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    Array.from(items).forEach(item => {
      if (item.type.includes('image')) {
        const file = item.getAsFile();
        if (file) {
          this.selectedFile = file;
          this.showPreview(file);
        }
      }
    });
  }

  // Preview
  showPreview(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      this.preview = base64;

      // 🔥 SALVA NO FORM
      this.form.patchValue({
        imageUrl: base64
      });
    };

    reader.readAsDataURL(file);
  }

}


