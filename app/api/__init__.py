import json

from flask import Blueprint, jsonify, request, Response

from app.extensions import OPENAI_CLIENT
from app.utils import parse_html_to_md, build_messages

api_blueprint = Blueprint("api", __name__)


@api_blueprint.post("")
def index():
    prompt = request.form.get("prompt")
    response_a = request.form.get("response_a")
    response_b = request.form.get('response_b')
    prompt = parse_html_to_md(prompt)
    response_a = parse_html_to_md(response_a)
    response_b = parse_html_to_md(response_b)

    messages = build_messages(prompt, response_a, response_b)

    res = OPENAI_CLIENT.chat.completions.create(
        # model="gpt-4",
        model="gpt-4-1106-preview",
        messages=messages,
        response_format={ "type": "json_object" },
    )
    print(res.choices[0].message.content)
    return jsonify(json.loads(res.choices[0].message.content))
