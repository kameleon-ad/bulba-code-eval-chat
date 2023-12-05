BASIS_MESSAGES = [
    {
        "role": "system",
        "content": "You are a helpful assistant"
    }
]

STATEMENT_MESSAGE = \
"""
In this project, you will be rating two different responses that are generated for the same prompt in a variety of programming languages. The task contains three main sections.

You will first need to read the prompt that's already provided and will need to answer questions about it.
Then you will look at two AI-generated responses and will rate the quality for each.
Lastly you will be comparing the two responses.


I'll give you one prompt and two responses to that.

1. Select which response do you recommend?

2. Please answer the following questions per response.
- Please rate the model response ("Incorrect" / "Partially Incorrect" / "Completely Correct")
    Completely Correct
        All claims in both the explanation and any code comments are factual and accurate; the code (if any) is functional, safe, and useful.
    Partially correct
        Either or both of the following are true:
            Text: primary claims (central to addressing the prompt) are factual / accurate; secondary claims contain meaningful inaccuracies (or unfounded claims).
                Examples include: an otherwise correct explanation of a library that uses an incorrect link, or a description of a system that misconstrues a small detail of its design.
            Code: has minor problems that are straightforward to fix (e.g., missing imports, small syntax errors), or is correct but has misleading comments.
    Incorrect
        Either or both of the following are true:
            Text: primary claims contain meaningful inaccuracies (or unfounded claims), such that the response is not helpful to the user.
                For example, a response that seriously mischaracterizes the design or usage of a library, or a response that mischaracterizes what the code does.
            Code: has one or more of the following problems:
                Do not use this to flag responses that make simplifying assumptions that a user would reasonably be expected to notice and improve, such as using a hard-coded password in a clearly visible location.
                    Functionality: the program does not compile or run and would require substantial effort to repair.
                    Safety: the code would create safety or security risks if used, such as relying on libraries with known vulnerabilities or failing to sanitize user inputs.
                    Performance: the code is unnecessarily slow, for instance, due to using a quadratic algorithm where a (log-)linear option exists, or repeatedly concatenating long strings instead of using a stringbuilder.
                    Documentation: the comments contain meaningful inaccuracies that make the code very hard to understand.
            Important Note:
                Keep in mind that the code may be functional for the prompter, even if it does not compile or run on your setup. For instance, a response that points to a file only accessible to the prompter, or provides a partial program based on the context provided by the prompter should not be marked as non-functional unless it contains errors that would (likely) manifest in the prompter’s programming context.
- How helpful is this response? ("Not helpful whatsoever" / "Minimally helpful" / "Moderately helpful" / "Very helpful")
    Very helpful
        The user has found what they are looking for entirely within the response.
        All prompt instructions were followed; response delivered fully on the tasks of the prompt.
    Moderately Helpful
        The user may have to use some outside sources to accomplish their goal.
        The response addressed most of the instructions or goal(s) of the prompt, but missed or misinterpreted some small parts.
            For example: a response that describes the right API but assumes a slightly different use-case than what the user articulates.
    minimally helpful
        The response isn't completely off track, but the user does not get much helpful information. The user will have to rely heavily on outside sources.
        The response missed key components of the prompt, rendering it unhelpful to the user.
            For example: a response that discusses a different programming language or library than what the user asked about, or misses a key requirement of the code to be generated.
    Not helpful whatsoever
        The response is not helpful or off-topic. The user is no closer to accomplishing their goal, and the response is completely useless.
            For example: a response that discusses how to grow peaches when asked for a peach pie recipe
- Estimate how long it would take you to answer this prompt starting from this response. (A) If the response is completely unhelpful, your answer should match your estimate from prompt question 3 above (time to answer the prompt from scratch). (B) Enter 0 if the response completely and correctly answers every aspect of the user's prompt.
    Estimate how long, in minutes, it would take you to answer this prompt from scratch (WITH the help of this response) (maximum is 30).
        Using this response, how long would it take you to come up with a very helpful answer for the user?
            If the response is completely unhelpful, your answer should match your estimate from prompt question 3 above (time to answer the prompt from scratch).
            Enter 0 if the response completely and correctly answers every aspect of the user's prompt.
            Otherwise, estimate how much time it would take you to make the necessary changes.
3. And as the result
- Which is better? (1 - 7: 1 - A is much better, 7 - B is much better, 4 - A and B are the same)
- Explain why (e.g: 1. first of all a is ..., 2. Second, ..., ...)
"""

ASKING_MESSAGE = \
"""
Write the answer in this format (json) to the question I gave you at first. keep the validation format of json. especailly: sxs.why
{
    best: "response ...",  \\ "response 1" / "response 2"
    "response 1": {
        "correct": "...", \\ "Incorrect" / "Partially correct" / "Completely correct"
        "helpful": "...", \\ "Not helpful whatsoever" / "Minimally helpful" / "Moderately helpful" / "Very helpful"
        "time": 5 \\ This field is related the response 1. How is the response correct and helpful. If the response 1 is perfect, there is no need to change the response and this field is 0.
    },
    "response 1": {
        "correct": "...", \\ "Incorrect" / "Partially correct" / "Completely correct"
        "helpful": "...", \\ "Not helpful whatsoever" / "Minimally helpful" / "Moderately helpful" / "Very helpful"
        "time": 0 \\ This field is related the response 1. How is the response correct and helpful. If the response 1 is perfect, there is no need to change the response and this field is 0.
    },
    "sxs": {
        "rate_which_is_better": 2,    \\ (1 - 7: 1 - A is much better, 7 - B is much better, 4 - A and B are the same) If the best is "response A", this field is smaller than 5 and if "response b", biggr than 3.
        "why": "1. First of all a is ...\n2. Second, ...\n..."
    }
}
"""
