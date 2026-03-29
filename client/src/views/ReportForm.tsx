import { useState, useRef, useCallback, useEffect, ChangeEvent, FormEvent, DragEvent, MouseEvent } from 'react'
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBValidation,
    MDBValidationItem,
    MDBInput,
    MDBTextArea,
    MDBBtn,
    MDBSpinner,
} from 'mdb-react-ui-kit'
import LocationPicker, { LocationResult } from './LocationPicker'
import '../styles/ReportForm.css'
import api from '../api'


interface FormData {
    location: string
    description: string
}

interface LocationData {
    address: string
    lat: number
    lng: number
}

export default function ReportForm() {
    /* ── State ── */
    const [formData, setFormData] = useState<FormData>({ location: '', description: '' })
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
    const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewSrc, setPreviewSrc] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [validated, setValidated] = useState<boolean>(false)
    const [fileError, setFileError] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ── Debugging: Log modal state ──
    useEffect(() => {
        console.log("Modal state changed:", showLocationPicker);
    }, [showLocationPicker])

    // ── Fix: tell Leaflet to recalculate map size after modal finishes opening ──
    useEffect(() => {
        if (!showLocationPicker) return
        // Wait for the modal animation to finish, then trigger resize
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 400)
        return () => clearTimeout(timer)
    }, [showLocationPicker])

    /* ── Location handlers ── */

    const handleLocationSelect = (loc: LocationResult) => {
        setSelectedLocation({
            address: loc.address,
            lat: loc.latLng.lat,
            lng: loc.latLng.lng,
        })
        setFormData((prev) => ({ ...prev, location: loc.address }))
        setShowLocationPicker(false)
    }

    const clearLocation = () => {
        setSelectedLocation(null)
        setFormData((prev) => ({ ...prev, location: '' }))
    }

    /* ── Other handlers ── */

    const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const loadPreview = (file: File | undefined) => {
        if (!file || !file.type.startsWith('image/')) {
            setFileError(true)
            setImageFile(null)
            setPreviewSrc(null)
            return
        }
        setFileError(false)
        setImageFile(file)
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
            setPreviewSrc(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        loadPreview(e.target.files?.[0])
    }

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        loadPreview(e.dataTransfer.files?.[0])
    }, [])

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const clearImage = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setImageFile(null)
        setPreviewSrc(null)
        setFileError(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setValidated(true)

        const form = formRef.current
        if (!form || !form.checkValidity()) {
            form?.reportValidity()
            return
        }

        if (!imageFile) {
            setFileError(true)
            return
        }

        setIsSubmitting(true)
        try {
            await api.submitReport(formData.location, formData.description, imageFile)
            setSubmitted(true)
            setTimeout(() => {
                setFormData({ location: '', description: '' })
                setSelectedLocation(null)
                setImageFile(null)
                setPreviewSrc(null)
                setSubmitted(false)
                setValidated(false)
                setFileError(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }, 4000)
        } catch {
            // error handled by API client via toast
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="app-wrapper">
            <MDBContainer style={{ maxWidth: 720, width: '100%' }}>

                {/* Header */}
                <div className="report-header">
                    <div className="badge-chip">
                        <i className="fas fa-shield-alt" />
                        Community Safety Tool
                    </div>
                    <h1>Submit an <span>Issue Report</span></h1>
                    <p>Help us make your neighborhood safer — reports are reviewed within 24 hours.</p>
                </div>

                {/* Success Banner */}
                {submitted && (
                    <div className="success-banner mb-4">
                        <i className="fas fa-check-circle fa-lg" />
                        <span>
                            <strong>Report submitted!</strong> Thank you — our team will investigate shortly.
                        </span>
                    </div>
                )}

                <MDBCard className="report-card">
                    <MDBCardBody className="p-4 p-md-5">
                        <MDBValidation
                            noValidate
                            className={`row g-4${validated ? ' was-validated' : ''}`}
                            onSubmit={handleSubmit}
                            ref={formRef}
                        >
                            {/* ── LOCATION ── */}
                            <MDBCol size="12">
                                <p className="card-section-title">
                                    <i className="fas fa-map-marked-alt" />
                                    Location Details
                                </p>

                                {selectedLocation && (
                                    <MDBCard className="mb-3 border-0 bg-light">
                                        <MDBCardBody className="p-3">
                                            <div className="d-flex align-items-start justify-content-between">
                                                <div className="d-flex align-items-start flex-grow-1">
                                                    <div className="text-primary me-3" style={{ fontSize: '1.5rem' }}>
                                                        <i className="fas fa-map-marker-alt" />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{selectedLocation.address}</h6>
                                                        <small className="text-muted">
                                                            📍 {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
                                                        </small>
                                                    </div>
                                                </div>
                                                <MDBBtn
                                                    type="button"
                                                    onClick={clearLocation}
                                                    size="sm"
                                                    color="danger"
                                                    outline
                                                    className="ms-2"
                                                >
                                                    <i className="fas fa-times" />
                                                </MDBBtn>
                                            </div>
                                        </MDBCardBody>
                                    </MDBCard>
                                )}

                                <div className="d-flex gap-2 mb-3">
                                    <MDBBtn
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Opening location picker...");
                                            setShowLocationPicker(true);
                                        }}
                                        color="primary"
                                        outline
                                        className="flex-grow-1"
                                    >
                                        <i className="fas fa-map me-2" />
                                        {selectedLocation ? 'Change Location' : 'Pick on Map'}
                                    </MDBBtn>
                                </div>

                                <div className="input-icon-wrapper">
                                    <MDBValidationItem invalid feedback="Please enter or select a location.">
                                        <MDBInput
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInput}
                                            label={<>Location <span className="req">*</span></>}
                                            placeholder="e.g. 42 Elm Street, Downtown"
                                            required
                                            maxLength={255}
                                            style={{ paddingLeft: '2.4rem' }}
                                        />
                                    </MDBValidationItem>
                                </div>
                                <p className="location-hint">
                                    <i className="fas fa-info-circle" />
                                    Enter a street address, landmark, or use the map to select a location.
                                </p>
                            </MDBCol>

                            {/* ── DESCRIPTION ── */}
                            <MDBCol size="12">
                                <p className="card-section-title">
                                    <i className="fas fa-file-alt" />
                                    Issue Description
                                </p>
                                <div className="input-icon-wrapper textarea-wrapper">
                                    <MDBValidationItem invalid feedback="Please describe the issue.">
                                        <MDBTextArea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInput}
                                            label={<>Description <span className="req">*</span></>}
                                            placeholder="Describe what happened, when you noticed it, and any other relevant details…"
                                            rows={5}
                                            required
                                            style={{ paddingLeft: '2.4rem' }}
                                        />
                                    </MDBValidationItem>
                                </div>
                                <p className="char-counter">
                                    {formData.description.length} {formData.description.length === 1 ? 'character' : 'characters'}
                                </p>
                            </MDBCol>

                            {/* ── IMAGE UPLOAD ── */}
                            <MDBCol size="12">
                                <p className="card-section-title">
                                    <i className="fas fa-camera" />
                                    Photo Evidence
                                </p>

                                <div
                                    className={`upload-zone${previewSrc ? ' has-image' : ''}${isDragging ? ' dragging' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    {previewSrc ? (
                                        <div className="preview-img-wrapper w-100">
                                            <img src={previewSrc} alt="Preview" className="preview-img w-100" />
                                            <div className="preview-overlay">
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="btn btn-sm btn-light fw-semibold"
                                                    style={{ fontSize: '0.75rem', borderRadius: 50 }}
                                                >
                                                    <i className="fas fa-times me-1" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <i className={`fas fa-cloud-upload-alt upload-icon${isDragging ? ' text-primary' : ''}`} />
                                            <p className="mb-1">
                                                <span>Click to upload</span> or drag &amp; drop
                                            </p>
                                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                PNG, JPG, WEBP — max 10 MB
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />

                                {fileError && (
                                    <p className="invalid-feedback d-block mt-1">
                                        Please select a valid image file.
                                    </p>
                                )}
                                {imageFile && !fileError && (
                                    <p className="location-hint mt-2">
                                        <i className="fas fa-check-circle text-success" />
                                        <strong>{imageFile.name}</strong>&nbsp;selected
                                        &nbsp;({(imageFile.size / 1024).toFixed(0)} KB)
                                    </p>
                                )}
                            </MDBCol>

                            {/* ── SUBMIT ── */}
                            <MDBCol size="12" className="d-flex flex-column align-items-center gap-2 mt-2">
                                <MDBBtn
                                    type="submit"
                                    className="submit-btn w-100 text-white fw-bold"
                                    disabled={isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <MDBSpinner size="sm" role="status" className="me-2" />
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2" />
                                            Submit Report
                                        </>
                                    )}
                                </MDBBtn>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <i className="fas fa-lock me-1" />
                                    Your report is encrypted and handled securely.
                                </p>
                            </MDBCol>
                        </MDBValidation>
                    </MDBCardBody>
                </MDBCard>

                {/* ── Location Picker Modal (Custom Implementation) ── */}
                {showLocationPicker && (
                    <>
                        {/* Backdrop */}
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                zIndex: 1040,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => setShowLocationPicker(false)}
                        >
                            {/* Modal Dialog */}
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '0.375rem',
                                    maxWidth: '900px',
                                    width: '90%',
                                    maxHeight: '90vh',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
                                    zIndex: 1050,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid #dee2e6',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <h5 style={{ margin: 0, fontSize: '1.25rem' }}>📍 Pick Location on Map</h5>
                                    <button
                                        type="button"
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            padding: 0,
                                            color: '#6c757d',
                                        }}
                                        onClick={() => setShowLocationPicker(false)}
                                        aria-label="Close"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Body */}
                                <div
                                    style={{
                                        padding: 0,
                                        maxHeight: 'calc(90vh - 70px)',
                                        overflowY: 'auto',
                                        flex: 1,
                                    }}
                                >
                                    <LocationPicker
                                        onLocationSelect={handleLocationSelect}
                                        defaultCenter={
                                            selectedLocation
                                                ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </MDBContainer>
        </div>
    )
}