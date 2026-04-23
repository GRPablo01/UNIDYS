import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-lecture-audio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lecture-audio.html',
  styleUrls: ['./lecture-audio.css'],
})
export class LectureAudio {

  speechEnabled = false;
  private utterance: SpeechSynthesisUtterance | null = null;

  textToRead: string =
    "Bonjour, bienvenue dans l'application. Voici la lecture audio.";

  private hoveredText: string = '';

  toggleSpeech() {
    if (this.speechEnabled) {
      this.stopSpeech();
    } else {
      this.startSpeech();
    }
  }

  /**
   * 🔥 TEXTE PRIORITAIRE :
   * 1. Texte sélectionné (surligné)
   * 2. Texte survolé
   * 3. Texte par défaut
   */
  private getTextToRead(): string {
    const selection = window.getSelection()?.toString().trim();

    if (selection && selection.length > 0) {
      return selection;
    }

    if (this.hoveredText && this.hoveredText.trim().length > 0) {
      return this.hoveredText;
    }

    return this.textToRead;
  }

  startSpeech() {
    if (!('speechSynthesis' in window)) {
      console.warn("SpeechSynthesis non supporté");
      return;
    }

    const text = this.getTextToRead();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = 'fr-FR';
    this.utterance.rate = 1;
    this.utterance.pitch = 1;

    this.utterance.onend = () => {
      this.speechEnabled = false;
    };

    window.speechSynthesis.cancel(); // évite superposition
    window.speechSynthesis.speak(this.utterance);

    this.speechEnabled = true;
  }

  stopSpeech() {
    window.speechSynthesis.cancel();
    this.speechEnabled = false;
  }

  /**
   * 👇 récupère le texte survolé
   */
  setHoverText(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target) return;

    const text = target.innerText?.trim();

    if (text) {
      this.hoveredText = text;
    }
  }

  /**
   * 🔥 mise à jour automatique si sélection change
   */
  @HostListener('document:selectionchange')
  onSelectionChange() {
    // optionnel : on pourrait auto-lire ou stocker
  }
}