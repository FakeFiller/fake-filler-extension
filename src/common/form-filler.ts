import ElementFiller from 'src/common/element-filler';

class FormFiller {
  private elementFiller: ElementFiller;
  private clickedElement: HTMLElement | undefined;

  constructor(options: IFormFillerOptions) {
    this.elementFiller = new ElementFiller(options);
  }

  private fillAllElements(container: Document | HTMLElement): void {
    container.querySelectorAll('input:not(:disabled):not([readonly])').forEach(element => {
      this.elementFiller.fillInputElement(element as HTMLInputElement);
    });

    container.querySelectorAll('textarea:not(:disabled):not([readonly])').forEach(element => {
      this.elementFiller.fillTextAreaElement(element as HTMLTextAreaElement);
    });

    container.querySelectorAll('select:not(:disabled):not([readonly])').forEach(element => {
      this.elementFiller.fillSelectElement(element as HTMLSelectElement);
    });

    container.querySelectorAll('[contenteditable]').forEach(element => {
      this.elementFiller.fillContentEditableElement(element as HTMLElement);
    });
  }

  public setClickedElement(element: HTMLElement | undefined): void {
    this.clickedElement = element;
  }

  public fillAllInputs(): void {
    this.fillAllElements(document);
  }

  public fillThisInput(): void {
    const element = this.clickedElement || document.activeElement;

    if (element) {
      const tagName = element.tagName.toLowerCase();

      if (tagName === 'input') {
        this.elementFiller.fillInputElement(element as HTMLInputElement);
      } else if (tagName === 'textarea') {
        this.elementFiller.fillTextAreaElement(element as HTMLTextAreaElement);
      } else if (tagName === 'select') {
        this.elementFiller.fillSelectElement(element as HTMLSelectElement);
      } else if ((<HTMLElement>element).isContentEditable) {
        this.elementFiller.fillContentEditableElement(element as HTMLElement);
      }
    }

    this.setClickedElement(undefined);
  }

  public fillThisForm(): void {
    const element = this.clickedElement || document.activeElement;

    if (element && element.tagName.toLowerCase() !== 'body') {
      const form = element.closest('form');

      if (form) {
        this.fillAllElements(form);
      }
    }

    this.setClickedElement(undefined);
  }
}

export default FormFiller;
