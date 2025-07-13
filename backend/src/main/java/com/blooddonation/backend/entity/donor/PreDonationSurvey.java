package com.blooddonation.backend.entity.donor;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "pre_donation_survey")
@Data
public class PreDonationSurvey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "survey_id")
    private Integer surveyId;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "has_flu_fever_cough", nullable = false)
    @Enumerated(EnumType.STRING)
    private FluFeverCoughStatus hasFluFeverCough = FluFeverCoughStatus.khong_co_trieu_chung;

    @Column(name = "has_sore_throat", nullable = false)
    @Enumerated(EnumType.STRING)
    private SoreThroatStatus hasSoreThroat = SoreThroatStatus.khong_co;

    @Column(name = "has_diarrhea_digestive_issues", nullable = false)
    @Enumerated(EnumType.STRING)
    private DigestiveIssuesStatus hasDiarrheaDigestiveIssues = DigestiveIssuesStatus.khong_co;

    @Column(name = "has_headache_dizziness_fatigue", nullable = false)
    @Enumerated(EnumType.STRING)
    private HeadacheDizzinessStatus hasHeadacheDizzinessFatigue = HeadacheDizzinessStatus.khong_co;

    @Column(name = "has_allergic_reactions", nullable = false)
    @Enumerated(EnumType.STRING)
    private AllergicReactionsStatus hasAllergicReactions = AllergicReactionsStatus.khong_co;

    @Column(name = "has_infection_open_wounds", nullable = false)
    @Enumerated(EnumType.STRING)
    private InfectionWoundsStatus hasInfectionOpenWounds = InfectionWoundsStatus.khong_co;

    @Column(name = "uses_antibiotics_medication", nullable = false)
    @Enumerated(EnumType.STRING)
    private AntibioticsMedicationStatus usesAntibioticsMedication = AntibioticsMedicationStatus.khong_su_dung_thuoc;

    @Column(name = "has_infectious_disease_history", nullable = false)
    @Enumerated(EnumType.STRING)
    private InfectiousDiseaseStatus hasInfectiousDiseaseHistory = InfectiousDiseaseStatus.khong_co;

    @Column(name = "has_hypertension_heart_disease", nullable = false)
    @Enumerated(EnumType.STRING)
    private HypertensionHeartStatus hasHypertensionHeartDisease = HypertensionHeartStatus.khong_co;

    @Column(name = "has_diabetes_chronic_diseases", nullable = false)
    @Enumerated(EnumType.STRING)
    private DiabetesChronicStatus hasDiabetesChronicDiseases = DiabetesChronicStatus.khong_co;

    @Column(name = "additional_notes")
    private String additionalNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Enums
    public enum FluFeverCoughStatus {
        khong_co_trieu_chung,
        sot_nhe,
        ho_khan,
        sot_cao_ho_nhieu
    }

    public enum SoreThroatStatus {
        khong_co,
        dau_nhe,
        viem_hong_nang
    }

    public enum DigestiveIssuesStatus {
        khong_co,
        tieu_chay_nhe,
        roi_loan_tieu_hoa_keo_dai
    }

    public enum HeadacheDizzinessStatus {
        khong_co,
        dau_dau_nhe,
        chong_mat_met_moi_nhieu
    }

    public enum AllergicReactionsStatus {
        khong_co,
        di_ung_nhe,
        di_ung_nang_phat_ban
    }

    public enum InfectionWoundsStatus {
        khong_co,
        vet_thuong_nho_da_lanh,
        nhiem_trung_vet_thuong_ho
    }

    public enum AntibioticsMedicationStatus {
        khong_su_dung_thuoc,
        thuoc_cam_cum_thong_thuong,
        khang_sinh_dieu_tri_benh_man_tinh
    }

    public enum InfectiousDiseaseStatus {
        khong_co,
        da_dieu_tri_on_dinh,
        dang_dieu_tri
    }

    public enum HypertensionHeartStatus {
        khong_co,
        huyet_ap_cao_kiem_soat_tot,
        huyet_ap_cao_chua_kiem_soat_benh_tim_mach
    }

    public enum DiabetesChronicStatus {
        khong_co,
        tieu_duong_kiem_soat_tot,
        tieu_duong_khong_kiem_soat_benh_man_tinh_khac
    }
} 