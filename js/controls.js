export class Controls {
  constructor() {
    this.allowed = `ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz0123456789`;
    this.answer = "";
    this.input = document.getElementById("answer");
    this.submit = document.getElementById("submit");
    this.next = document.getElementById("skip");
    this.reveal = document.getElementById("reveal");
    this.new = document.getElementById("new");
  }

  enable() {
    this.submit.disabled = false;
    this.reveal.disabled = false;
    this.next.disabled = false;
  }

  disable() {
    this.submit.disabled = true;
    this.reveal.disabled = true;
    this.next.disabled = true;
  }

  reFocus() {
    this.submit.disabled = true;
    this.reveal.disabled = true;
    this.next.focus();
  }

  showAnswer() {
    const fields = document.querySelectorAll("input");
    fields.forEach((el, i) => {
      el.value = this.answer[i];
    });
  }

  getResponse() {
    const fields = document.querySelectorAll("input");
    let response = "";
    fields.forEach((el, i) => {
      response += el.value;
    });
    return response;
  }

  checkButton(key, position, fields) {
    if (key == "Backspace" && position > 0) {
      fields[position - 1].select();
    } else if (key == "Backspace" && position == 0) {
      fields[position].focus();
    } else if (position == fields.length - 1) {
      document.getElementById("submit").focus();
    } else {
      fields[position + 1].select();
    }
  }

  fieldFocus() {
    const fields = document.querySelectorAll("input");
    fields.forEach((el, i) => {
      el.addEventListener("keyup", (e) => {
        this.checkButton(e.code, i, fields);
      });
    });
  }

  subscribe(callback) {
    this.next.addEventListener("click", () => {
      document.getElementById("text").innerText = "";
      callback.nextBtnEvents();
    });
    this.reveal.addEventListener("click", () => {
      this.reFocus();
      this.showAnswer();
      callback.revealBtnEvents();
    });
    this.submit.addEventListener("click", () => {
      const response = this.getResponse();
      if (response.toLowerCase() == this.answer.toLowerCase()) {
        document.getElementById("text").innerText = "BRAWO!";
        this.reFocus();
        callback.submitBtnEvents();
      } else {
        document.getElementById("text").innerText = "ŹLE";
      }
    });
    this.new.addEventListener("click", () => {
      callback.newBtnEvents();
    });
  }

  createInputs(item) {
    const words = item.title.split(" ");
    let generated = ``;
    this.answer = "";
    for (let i = 0; i < words.length; i++) {
      generated += `<span>`;
      for (let j = 0; j < words[i].length; j++) {
        if (this.allowed.indexOf(words[i][j]) == -1) {
          generated += `<span> ${words[i][j]} </span>`;
        } else {
          this.answer += words[i][j];
          generated += `<input type="text" name="${
            (i, j)
          }" required minlength="1" maxlength="1" size="1">`;
        }
      }
      generated += `</span>`;
    }
    this.input.innerHTML = generated;
  }
}
