from flask import Blueprint, request, jsonify
from backend.models.story import Story
from backend.config import db

stories_bp = Blueprint('stories_bp', __name__, url_prefix='/stories')

@stories_bp.route('/', methods=['GET'])
def get_stories():
    stories = Story.query.all()
    return jsonify([{
        'id': s.id,
        'charity_id': s.charity_id,
        'title': s.title,
        'content': s.content,
        'image_url': s.image_url
    } for s in stories]), 200

@stories_bp.route('/<int:id>', methods=['GET'])
def get_story(id):
    story = Story.query.get(id)
    if not story:
        return jsonify({'error': 'Story not found'}), 404

    return jsonify({
        'id': story.id,
        'charity_id': story.charity_id,
        'title': story.title,
        'content': story.content,
        'image_url': story.image_url
    }), 200

@stories_bp.route('/', methods=['POST'])
def create_story():
    data = request.get_json()
    story = Story(
        charity_id=data.get('charity_id'),
        title=data.get('title'),
        content=data.get('content'),
        image_url=data.get('image_url')
    )
    db.session.add(story)
    db.session.commit()
    return jsonify({'message': 'Story created', 'id': story.id}), 201

@stories_bp.route('/<int:id>', methods=['PATCH'])
def update_story(id):
    story = Story.query.get(id)
    if not story:
        return jsonify({'error': 'Story not found'}), 404

    data = request.get_json()
    for field in ['title', 'content', 'image_url']:
        if field in data:
            setattr(story, field, data[field])
    db.session.commit()
    return jsonify({'message': 'Story updated'}), 200

@stories_bp.route('/<int:id>', methods=['DELETE'])
def delete_story(id):
    story = Story.query.get(id)
    if not story:
        return jsonify({'error': 'Story not found'}), 404

    db.session.delete(story)
    db.session.commit()
    return jsonify({'message': 'Story deleted'}), 200
