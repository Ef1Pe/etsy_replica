"""Agenticverse entity definition for the Etsy replica."""

from agenticverse_entities.base.entity_base import AgenticEntity

from metadata import EtsyReplicaMetadata


class EtsyReplicaEntity(AgenticEntity):
    entity_id = "etsy_replica"
    human_name = "Etsy Marketplace Replica"
    description = "Pixel-perfect replica of Etsy's handcrafted marketplace with dynamic content injection."
    metadata_cls = EtsyReplicaMetadata
