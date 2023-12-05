from copy import deepcopy

import html2text

from app.constants import BASIS_MESSAGES, ASKING_MESSAGE


def parse_html_to_md(html_content: str):
    return HTML2MARKDOWN_PARSER.handle(html_content)


def build_messages(prompt, response_a, response_b):
    message = deepcopy(BASIS_MESSAGES)
    message.extend([
        {"role": "user", "content": "Here is the prompt"},
        {"role": "user", "content": prompt},
        {"role": "user", "content": "Here is the response 1"},
        {"role": "user", "content": response_a},
        {"role": "user", "content": "Here is the response 2"},
        {"role": "user", "content": response_b},
        {"role": "user", "content": "Please generate the answer. And regarding the estimationg of the time. The maximum is 30"},
        {"role": "user", "content": ASKING_MESSAGE},
    ])
    return message


HTML2MARKDOWN_PARSER = html2text.HTML2Text()
HTML2MARKDOWN_PARSER.body_width = 0
