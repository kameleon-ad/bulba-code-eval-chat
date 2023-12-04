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
    const response_selection_selector = "[class='w-full text-left border border-neutral-200 rounded h-fit scaleui bg-neutral-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 transition-colors h-full flex-1 cursor-pointer shadow hover:border hover:border-primary-200 border border-primary-600']";
    const reasoning = (element, ) => {
        element.querySelectorAll("div.MuiFormGroup-root").forEach(element => {
            console.log(element.innerText);
            switch (element.innerText) {
            }
        });
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
            const ele = responses_ele.querySelectorAll(response_selection_selector);
            console.log(ele);
            
            // response_a_ele.dispatchEvent(clickEvent);

            // submit_handler = setInterval(() => {
            //     const elements = document.querySelectorAll(main_block_selector);
            //     if (elements.length == 5) {
            //         clearInterval(submit_handler);

            //         const reason_a_ele = elements[3];
            //         const reason_b_ele = elements[4];
            //         reasoning(reason_a_ele);
            //         reasoning(reason_b_ele);
            //     }
            // }, 1000);
        }
    }, 1000);
};

