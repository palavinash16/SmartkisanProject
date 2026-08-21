"""Unit test suite for Phase 3A.1 Crop Knowledge Base Schema Foundation."""

import uuid
import pytest

from app.modules.gap_crop.models import (
    AgriculturalSourceModel,
    CropAgronomicProfile,
    CropEconomicProfile,
    CropMaster,
    CropRegionalProfile,
    CropVariety,
    KnowledgeSource,
)


def test_crop_master_and_source_creation():
    """1. Test creating CropMaster and KnowledgeSource entity."""
    src = AgriculturalSourceModel(
        tier="TIER_1_ICAR",
        organization="ICAR - Indian Agricultural Research Institute (IARI)",
        source_title="Package of Practices for Commercial & Vegetable Crops",
        url="https://iari.icar.gov.in",
        verification_status="Verified",
        source_type="ICAR_IARI",
    )
    crop = CropMaster(
        crop_name="Test Watermelon",
        code="test_watermelon",
        scientific_name="Citrullus lanatus",
        hindi_name="तरबूज",
        category="FRUIT",
        sub_category="Cucurbit",
        growth_habit="Vine",
        is_gap_candidate=True,
        min_duration_days=80,
        max_duration_days=95,
        water_requirement="Medium",
        season="Zaid / Summer",
    )
    assert crop.crop_name == "Test Watermelon"
    assert crop.category == "FRUIT"
    assert src.source_type == "ICAR_IARI"
    assert KnowledgeSource == AgriculturalSourceModel


def test_agronomic_profile_nullable_unverified_fields():
    """2. Test CropAgronomicProfile allows nullable unverified agricultural values."""
    crop_id = uuid.uuid4()
    agri_profile = CropAgronomicProfile(
        crop_id=crop_id,
        temperature_min_c=18.0,
        temperature_optimal_min_c=25.0,
        temperature_optimal_max_c=35.0,
        temperature_max_c=40.0,
        rainfall_min_mm=None,  # Nullable when unverified
        rainfall_optimal_min_mm=None,
        soil_types=["Loamy", "Sandy Loam"],
        soil_ph_min=6.0,
        soil_ph_max=7.5,
        waterlogging_tolerance="Sensitive",
        drought_tolerance="Moderate",
    )
    assert agri_profile.temperature_optimal_min_c == 25.0
    assert agri_profile.rainfall_min_mm is None
    assert agri_profile.soil_types == ["Loamy", "Sandy Loam"]
    assert agri_profile.waterlogging_tolerance == "Sensitive"


def test_regional_profile_unknown_vs_not_suitable_distinction():
    """3. Test CropRegionalProfile distinguishes UNKNOWN from NOT_SUITABLE."""
    crop_id = uuid.uuid4()
    reg_suitable = CropRegionalProfile(
        crop_id=crop_id,
        state_name="Uttar Pradesh",
        district_name="Ghaziabad",
        season="Zaid / Summer",
        regional_suitability="SUITABLE",
    )
    reg_unknown = CropRegionalProfile(
        crop_id=crop_id,
        state_name="Kerala",
        district_name=None,
        season="Kharif",
        regional_suitability="UNKNOWN",
        reason="Insufficient regional agromet trial data",
    )
    reg_unsuitable = CropRegionalProfile(
        crop_id=crop_id,
        state_name="Jammu & Kashmir",
        district_name=None,
        season="Winter",
        regional_suitability="NOT_SUITABLE",
        reason="Frost risk exceeds threshold",
    )

    assert reg_suitable.regional_suitability == "SUITABLE"
    assert reg_unknown.regional_suitability == "UNKNOWN"
    assert reg_unsuitable.regional_suitability == "NOT_SUITABLE"
    assert reg_unknown.regional_suitability != reg_unsuitable.regional_suitability


def test_economic_profile_cost_breakdown_and_yield():
    """4. Test CropEconomicProfile supports yield and granular cost breakdown per acre."""
    crop_id = uuid.uuid4()
    econ = CropEconomicProfile(
        crop_id=crop_id,
        yield_min_qtl_acre=120.0,
        yield_typical_qtl_acre=150.0,
        yield_max_qtl_acre=180.0,
        seed_cost_per_acre=3500.0,
        fertilizer_cost_per_acre=4200.0,
        pesticide_cost_per_acre=1800.0,
        labour_cost_per_acre=6500.0,
        irrigation_cost_per_acre=2000.0,
        total_cost_typical=18000.0,
    )
    assert econ.yield_typical_qtl_acre == 150.0
    assert econ.seed_cost_per_acre == 3500.0
    assert econ.labour_cost_per_acre == 6500.0
    assert econ.total_cost_typical == 18000.0


def test_crop_variety_future_ready():
    """5. Test CropVariety links to CropMaster."""
    crop_id = uuid.uuid4()
    variety = CropVariety(
        crop_id=crop_id,
        variety_name="Sugar Baby",
        variety_code="sugar_baby_w1",
        duration_days_min=85,
        duration_days_max=90,
        typical_yield_qtl_acre=160.0,
        characteristics={"tss_brix": 11.5, "flesh_color": "Deep Red"},
    )
    assert variety.variety_name == "Sugar Baby"
    assert variety.characteristics["tss_brix"] == 11.5



@pytest.fixture
def db_session():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.db.base import Base
    from app.modules.gap_crop.models import (
        AgriculturalSourceModel,
        CropMaster,
        CropAgronomicProfile,
        CropRegionalProfile,
        CropEconomicProfile,
        CropVariety,
    )

    engine = create_engine('sqlite:///:memory:')
    tables = [
        AgriculturalSourceModel.__table__,
        CropMaster.__table__,
        CropAgronomicProfile.__table__,
        CropRegionalProfile.__table__,
        CropEconomicProfile.__table__,
        CropVariety.__table__,
    ]
    Base.metadata.create_all(engine, tables=tables)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


def test_seed_knowledge_base(db_session):
    # Verify seed_knowledge_base populates source-linked records correctly.
    from app.modules.gap_crop.seed_data import seed_knowledge_base
    from app.modules.gap_crop.models import (
        CropMaster, AgriculturalSourceModel, CropAgronomicProfile,
        CropRegionalProfile, CropEconomicProfile
    )

    stats = seed_knowledge_base(db_session)
    assert stats['sources'] > 0
    assert stats['crops'] >= 18

    # Verify idempotency
    stats2 = seed_knowledge_base(db_session)
    assert stats2['sources'] == 0
    assert stats2['crops'] == 0

    # Source Traceability Test
    wm = db_session.query(CropMaster).filter_by(code='watermelon').first()
    assert wm is not None
    assert wm.agronomic_profile is not None
    assert wm.agronomic_profile.source_id is not None
    assert wm.agronomic_profile.source.organization == 'ICAR - Indian Institute of Horticultural Research (IIHR)'

    # Regional Suitability Distinction Test
    up_reg = db_session.query(CropRegionalProfile).filter_by(crop_id=wm.id, state_name='Uttar Pradesh').first()
    assert up_reg is not None
    assert up_reg.regional_suitability == 'SUITABLE'

    jk_reg = db_session.query(CropRegionalProfile).filter_by(crop_id=wm.id, state_name='Jammu & Kashmir').first()
    assert jk_reg is not None
    assert jk_reg.regional_suitability == 'NOT_SUITABLE'

    kl_reg = db_session.query(CropRegionalProfile).filter_by(crop_id=wm.id, state_name='Kerala').first()
    assert kl_reg is not None
    assert kl_reg.regional_suitability == 'UNKNOWN'

    # Field nullability verification (Honest Data Test)
    wheat = db_session.query(CropMaster).filter_by(code='rabi_wheat').first()
    assert len(wheat.economic_profiles) > 0
    assert wheat.economic_profiles[0].machinery_cost_per_acre is None
