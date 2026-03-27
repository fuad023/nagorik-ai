import { useState, useRef, useCallback, ChangeEvent, FormEvent, DragEvent, MouseEvent } from 'react'
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

const MAX_DESC = 500

interface FormData {
    location: string;
    description: string;
}
import '../styles/ReportForm.css';
import api from '../api';

export default function ReportForm() {
    /* ── State ── */
    const [formData, setFormData] = useState<FormData>({ location: '', description: '' })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewSrc, setPreviewSrc] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [validated, setValidated] = useState<boolean>(false)
    const [fileError, setFileError] = useState<boolean>(false)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'description' && value.length > MAX_DESC) return
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
        const file = e.target.files?.[0]
        loadPreview(file)
    }

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        loadPreview(file)
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

        // submission
        try {
            await api.submitReport(formData.location, formData.description, imageFile)
            setSubmitted(true)
            
            //success banner
            setTimeout(() => {
                setFormData({ location: '', description: '' })
                setImageFile(null)
                setPreviewSrc(null)
                setSubmitted(false)
                setValidated(false)
                setFileError(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
            }, 4000)
        } catch (error) {
            // error is handled by the API client via toast
        } finally {
            setIsSubmitting(false)
        }
    }

    const descLen = formData.description.length

    return (
        <div className="app-wrapper">
            <MDBContainer style={{ maxWidth: 720, width: '100%' }}>
             {/* Header */}
            <div className="report-header">
                <div className="badge-chip">
                    <i className="fas fa-shield-alt" />
                    Community Safety Tool
                </div>
                <h1>
                    Submit an <span>Issue Report</span>
                </h1>
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
                            <div className="input-icon-wrapper">
                                <MDBValidationItem
                                    invalid
                                    feedback="Please enter a location."
                                >
                                    <MDBInput
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInput}
                                        label={<>Location <span className="req">*</span></>}
                                        placeholder="e.g. 42 Elm Street, Downtown"
                                        required
                                        style={{ paddingLeft: '2.4rem' }}
                                    />
                                </MDBValidationItem>
                            </div>
                            <p className="location-hint">
                                <i className="fas fa-info-circle" />
                                Enter a street address, landmark, or neighbourhood name.
                            </p>
                        </MDBCol>

                        {/* ── DESCRIPTION ── */}
                        <MDBCol size="12">
                            <p className="card-section-title">
                                <i className="fas fa-file-alt" />
                                Issue Description
                            </p>
                            <div className="input-icon-wrapper textarea-wrapper">
                                <MDBValidationItem
                                    invalid
                                    feedback="Please describe the issue (minimum 32 characters)."
                                >
                                    <MDBTextArea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInput}
                                        label={<>Description <span className="req">*</span></>}
                                        placeholder="Describe what happened, when you noticed it, and any other relevant details…"
                                        rows={5}
                                        required
                                        minLength={32}
                                        style={{ paddingLeft: '2.4rem' }}
                                    />
                                </MDBValidationItem>
                            </div>
                            <p className={`char-counter${descLen > MAX_DESC * 0.9 ? descLen >= MAX_DESC ? ' limit' : ' warn' : ''}`}>
                                {descLen} / {MAX_DESC}
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

                            {/* Hidden native file input */}
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
        </MDBContainer>
        </div>
        
    )
}