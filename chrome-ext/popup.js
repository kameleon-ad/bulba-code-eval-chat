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
    const upload_url = "http://localhost:5000/api";
    const result = {
        best: null,
        response_1: {
            correct: null,
            helpful: null,
            time: null,
        },
        response_2: {
            correct: null,
            helpful: null,
            time: null,
        },
        sxs: {
            rate_which_is_better: null,
            why: null,
        }
    };
    
    const selecting_response = (prompt, response_a_ele, response_b_ele) => {
        const response_a = response_a_ele.innerHTML;
        const response_b = response_b_ele.innerHTML;
        fetch(upload_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                prompt,
                response_a,
                response_b,
            }),
            redirect: 'follow'
        })
        .then(res => res.json())
        .then((data) => {
            result.best = data.best;
            result.response_1.correct = data['response 1'].correct;
            result.response_1.helpful = data['response 1'].helpful;
            result.response_1.time = data['response 1'].time;
            result.response_2.correct = data['response 2'].correct;
            result.response_2.helpful = data['response 2'].helpful;
            result.response_2.time = data['response 2'].time;
            result.sxs = data['sxs'];
            if (result.best.toLowerCase() == "response 1") {
                response_a_ele.dispatchEvent(clickEvent);
            } else if (result.best.toLowerCase() == "response 2") {
                response_b_ele.dispatchEvent(clickEvent);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    const reasoning = (element=document.createElement("div"), reason={correct: "Incorrect", helpful: "Very helpful", time: 30}) => {
        element.querySelectorAll("div.MuiFormGroup-root").forEach(element => {
            switch (element.innerText.trim()) {
                case "Incorrect\nPartially corret\nCompletely correct":
                    element.querySelectorAll("label.MuiFormControlLabel-root").forEach(item => {
                        if (item.innerText.trim().toLowerCase()[0] === reason.correct.toLowerCase()[0]) {
                            item.querySelector("input").dispatchEvent(clickEvent);
                        }
                    });
                    break;
                
                case "Not helpful whatsoever\nMinimally helpful\nModerately helpful\nVery helpful":
                    element.querySelectorAll("label.MuiFormControlLabel-root").forEach(item => {
                        if (item.innerText.trim().toLowerCase() === reason.helpful.toLowerCase()) {
                            item.querySelector("input").dispatchEvent(clickEvent);
                        }
                    });
                    break;
            }
        });
        const estimation_ele = element.querySelector("input.MuiInputBase-input.MuiOutlinedInput-input");
        estimation_ele.value = reason.time;
        estimation_ele.dispatchEvent(changeEvent);

        const save_btn = element.querySelector("button");
        const watch_btn_interval = setInterval(() => {
            if (save_btn.disabled) {
                return;
            }
            clearInterval(watch_btn_interval);
            save_btn.dispatchEvent(clickEvent);
        }, 1000);
    };

    const resolving_sxs = (target_ele=document.createElement("div"), response_a_ele, response_b_ele) => {
        const sxs_slider = target_ele.querySelector("span.MuiSlider-root.MuiSlider-colorPrimary.MuiSlider-marked");
        const sxs_slider_ele = sxs_slider.querySelectorAll("span.MuiSlider-mark");
        sxs_slider_ele[result.sxs.rate_which_is_better - 1].dispatchEvent(clickEvent);
        target_ele.querySelectorAll("span.MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1").forEach(span => {
            if (span.innerText === "High") {
                span.parentElement.querySelector("input").dispatchEvent(clickEvent);
            }
        });
        const why_ele = target_ele.querySelector("textarea");
        why_ele.value = result.sxs.why;
        why_ele.dispatchEvent(changeEvent);

        let submit_handler = setInterval(() => {
            const submit_btn = target_ele.querySelector("button");
            if (submit_btn.disabled) return;
            clearInterval(submit_handler);
            submit_btn.dispatchEvent(clickEvent);
            submit_handler = setInterval(() => {
                const submit_btn = document.querySelector("[class*='task-footer__right']").querySelectorAll("button")[1];
                if (submit_btn.disabled) {
                    return;
                }
                clearInterval(submit_handler);
            }, 2000);
        }, 2000);
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

    let submit_handler = setInterval(() => {
        const submit_btn = document.querySelector(main_block_selector).querySelector("button");
        // if (submit_btn.disabled) return ;
        submit_btn.dispatchEvent(clickEvent);
        clearInterval(submit_handler);
    
        submit_handler = setInterval(() => {
            const elements = document.querySelectorAll(main_block_selector);

            if (elements.length > 1) {
                const responses_ele = elements[1];
                clearInterval(submit_handler);
                const [response_a_ele, response_b_ele] = responses_ele.querySelectorAll(response_selection_selector);
                
                selecting_response(prompt, response_a_ele, response_b_ele);

                submit_handler = setInterval(() => {
                    const main_blocks = document.querySelectorAll(main_block_selector);
                    if (main_blocks.length > 4 && result.best !== null) {
                        clearInterval(submit_handler);

                        const reason_a_ele = main_blocks[3];
                        const reason_b_ele = main_blocks[4];
                        reasoning(reason_a_ele, result.response_1);
                        reasoning(reason_b_ele, result.response_2);

                        submit_handler = setInterval(() => {
                            const main_blocks = document.querySelectorAll(main_block_selector);
                            if (main_blocks.length > 5 && result.best !== null) {
                                clearInterval(submit_handler);
                                const sxs_ele = main_blocks[5];
                                resolving_sxs(sxs_ele);
                            }
                        }, 10000);
                    }
                }, 1000);
            }
        }, 1000);
    }, 2000);
};
