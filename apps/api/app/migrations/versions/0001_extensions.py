"""Enable PostGIS and pgvector extensions.

Runs before every other migration — the profile tables use Geometry columns and
Phase 5's scheme RAG uses vector columns.

Revision ID: 0001_extensions
Revises:
Create Date: 2026-08-04
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0001_extensions"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    # gen_random_uuid(), used as a server-side default where useful.
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")


def downgrade() -> None:
    # Extensions are intentionally NOT dropped: other schemas in the same
    # database may depend on them, and dropping PostGIS cascades to any
    # geometry column in the cluster.
    pass
