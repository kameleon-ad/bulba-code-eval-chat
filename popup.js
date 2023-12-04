const start_btn = document.getElementById("start");
start_btn.onclick = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: process_problem,
        });
    });
}


const process_problem = () => {
    const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    const changeEvent = new Event("change", { bubbles: true });
    const main_block_selector = "[class='w-full text-left border border-neutral-200 rounded h-fit scaleui bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors']";
    const response_selection_selector = "[class*='w-full text-left border border-neutral-200 rounded h-fit scaleui bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors h-full flex-1 cursor-pointer shadow hover:border hover:border-primary-200']";
    
    const selecting_response = (response_a, response_b) => {
        response_a.dispatchEvent(clickEvent);
    }
    
    const reasoning = (element=document.createElement("div"), correct="Incorrect", helpful="Very helpful") => {
        element.querySelectorAll("div.MuiFormGroup-root").forEach(element => {
            switch (element.innerText.trim()) {
                case "Incorrect\nPartially corret\nCompletely correct":
                    element.querySelectorAll("label.MuiFormControlLabel-root").forEach(item => {
                        if (item.innerText.trim() === correct) {
                            item.querySelector("input").dispatchEvent(clickEvent);
                        }
                    });
                    break;
                
                case "Not helpful whatsoever\nMinimally helpful\nModerately helpful\nVery helpful":
                    element.querySelectorAll("label.MuiFormControlLabel-root").forEach(item => {
                        if (item.innerText.trim() === helpful) {
                            item.querySelector("input").dispatchEvent(clickEvent);
                        }
                    });
                    break;
            }
        });
        const estimation_ele = element.querySelector("input.MuiInputBase-input.MuiOutlinedInput-input");
        estimation_ele.value = "30";
        estimation_ele.dispatchEvent(changeEvent);

        element.querySelector("button").dispatchEvent(clickEvent);
    };

    const prompt_ele = document.querySelector("div.flex.flex-col.gap-1.w-full>div>div.prose.prose-neutral.prose-sm.max-w-none");
    const prompt = prompt_ele.innerHTML;

    document.querySelectorAll("div.MuiFormGroup-root")
        .forEach(element => {
            switch (element.innerText) {
                case "Beginner\nModerate familiarity\nExpert":
                    element.children[1]?.querySelector("input")?.dispatchEvent(clickEvent);
                    break;
                case "Trivial to answer\nModerately difficult involved\nHighly complex / Time consuming":
                    element.children[1]?.querySelector("input")?.dispatchEvent(clickEvent);
                    break;
            }
        });
    document.querySelectorAll("div.MuiFormControl-root.MuiTextField-root.MuiFormControl-fullWidth")
        .forEach(element => {
            if (element.parentElement.innerText.trim().includes("Estimate how long, in minutes, it would take you to answer this prompt from scratch (Without the help of this response). *")) {
                const input_ele = element.querySelector("input");
                input_ele.value = "30";
                input_ele.dispatchEvent(changeEvent);
            }
        });

    document
        .querySelector(main_block_selector)
        ?.querySelector("button")
        ?.dispatchEvent(clickEvent);
    
    let submit_handler = setInterval(() => {
        const elements = document.querySelectorAll(main_block_selector);

        if (elements.length > 1) {
            const responses_ele = elements[1];
            clearInterval(submit_handler);
            const [response_a_ele, response_b_ele] = responses_ele.querySelectorAll(response_selection_selector);
            
            selecting_response(response_a_ele, response_b_ele);

            submit_handler = setInterval(() => {
                const elements = document.querySelectorAll(main_block_selector);
                if (elements.length == 5) {
                    clearInterval(submit_handler);

                    const reason_a_ele = elements[3];
                    const reason_b_ele = elements[4];
                    reasoning(reason_a_ele);
                    reasoning(reason_b_ele);
                }
            }, 1000);
        }
    }, 1000);
};
