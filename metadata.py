"""Metadata schema for the Etsy replica entity."""

from agenticverse_entities.base.metadata_base import BaseMetadata, Metadata


class EtsyReplicaMetadata(BaseMetadata):
    """Describe the configurable content for the replica."""

    def get_metadata(self) -> Metadata:
        return Metadata(
            domain="*.etsy.com",
            parameters={
                "port": "integer",
                "section": "string",
                "selector": "string",
                "product_name": "string",
                "title": "string",
                "description": "string",
                "category": "string",
                "price": "number",
                "original_price": "number",
                "badge": "string",
                "image_url": "string",
                "rating": "number",
                "reviews": "integer",
                "featured": "boolean",
                "inventory_status": "string",
                "cta_label": "string",
            },
        )
