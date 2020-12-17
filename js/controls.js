export class Controls {
    constructor(options){
        this.next = '';
        this.reveal = '';
        this.submit = '';
        this.new = '';
    }

    register(){
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
  
    subscribe(callback){
        this.next.addEventListener("click",() => {
            document.getElementById('text').innerText = "";
            callback.nextBtnEvents();
        })
        this.reveal.addEventListener("click",() => {
            this.submit.disabled = true; 
            this.reveal.disabled = true;
            callback.revealBtnEvents();
        })
                this.submit.addEventListener("click", () => {
                    const fields = document.querySelectorAll('input');
                    let response = "";
                    fields.forEach((el, i) => {
                        response += el.value;
                    })
                    if (callback.checkAnswer(response)) {
                        document.getElementById('text').innerText = "BRAWO!";
                        
                        this.submit.disabled = true;
                        this.reveal.disabled = true;
                        this.next.focus();
                        callback.submitBtnEvents();
                    } else {
                        document.getElementById('text').innerText = "ŹLE"
                    }
                    
                })
                this.new.addEventListener("click",() => {
            callback.newBtnEvents();
        })
    }
}