"""Alembic environment.

The database URL comes from application settings, so migrations and the app can
never drift onto different databases.
"""

from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.config import settings
from app.db.base import Base

# Import every model module so `Base.metadata` is fully populated before
# autogenerate runs. A missing import here silently drops tables from migrations.
from app.modules.profile import models as _profile_models  # noqa: F401
from app.modules.gap_crop import models as _gap_crop_models  # noqa: F401

config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


#: Tables PostGIS creates and manages itself — never ours to migrate.
_POSTGIS_TABLES = frozenset({"spatial_ref_sys", "geography_columns", "geometry_columns"})


def include_object(obj, name, type_, reflected, compare_to) -> bool:
    """Skip PostGIS-managed tables so they never appear in our migrations."""
    return not (type_ == "table" and name in _POSTGIS_TABLES)


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
