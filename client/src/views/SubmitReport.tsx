import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBIcon,
  MDBProgress,
  MDBProgressBar
} from 'mdb-react-ui-kit';
import '../styles/submit-report.css';

const SubmitReport: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null as null | File,
    imagePreview: '',
    location: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: ''
  });

  const nextStep = () => {
    // Simple validation for step 1
    if (step === 1) {
      if (!formData.title || !formData.description || !formData.category) {
        setErrors({
          title: !formData.title ? 'Title is required' : '',
          description: !formData.description ? 'Description is required' : '',
          category: !formData.category ? 'Category is required' : ''
        });
        return;
      }
      setErrors({ title: '', description: '', category: '' });
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const clearImage = () => {
    setFormData({ ...formData, image: null, imagePreview: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting report', formData);
    // Submit logic here
    setStep(4); // Show success message
  };

  return (
    <MDBContainer className="py-5 submit-report-container">
      <MDBRow className="justify-content-center">
        <MDBCol md="10" lg="8">
          <MDBCard className="shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="bg-primary text-white p-4 text-center header-section">
              <h3 className="fw-bold mb-1">Submit a Civic Issue</h3>
              <p className="mb-0 text-white-50">Help us improve your neighborhood</p>
            </div>
            
            {/* Progress Bar */}
            <MDBProgress height="8" style={{ borderRadius: '0' }}>
              <MDBProgressBar width={step === 1 ? 33 : step === 2 ? 66 : 100} valuemin={0} valuemax={100} className="bg-warning" />
            </MDBProgress>
            
            <MDBCardBody className="p-4 p-md-5 bg-white">
              <div className="d-flex justify-content-between mb-4 step-indicators">
                <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-circle"><MDBIcon fas icon="file-alt" /></div>
                  <span className="step-label">Details</span>
                </div>
                <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-circle"><MDBIcon fas icon="map-marker-alt" /></div>
                  <span className="step-label">Location</span>
                </div>
                <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
                  <div className="step-circle"><MDBIcon fas icon="check-double" /></div>
                  <span className="step-label">Review</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="form-section fade-in">
                    <h5 className="mb-4 text-dark fw-bold border-bottom pb-2">Issue Details</h5>
                    
                    <div className="mb-4">
                      <MDBInput
                        label="Issue Title"
                        id="title"
                        name="title"
                        type="text"
                        size="lg"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={formData.title && !errors.title ? 'is-valid' : errors.title ? 'is-invalid' : ''}
                      />
                      {errors.title && <div className="text-danger small mt-1"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.title}</div>}
                    </div>

                    <div className="mb-4">
                      <select 
                        className={`form-select form-select-lg ${formData.category && !errors.category ? 'is-valid' : errors.category ? 'is-invalid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        aria-label="Category select"
                      >
                        <option value="" disabled>Select Category (e.g. Road, Water)</option>
                        <option value="Roads & Streets">&#128643; Roads & Streets</option>
                        <option value="Water Supply">&#128167; Water Supply</option>
                        <option value="Waste Management">&#128465; Waste Management</option>
                        <option value="Public Safety">&#128110; Public Safety</option>
                        <option value="Other">&#10067; Other</option>
                      </select>
                      {errors.category && <div className="text-danger small mt-1"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.category}</div>}
                    </div>

                    <div className="mb-4">
                      <div className="form-outline">
                        <textarea
                          className={`form-control form-control-lg ${formData.description && !errors.description ? 'is-valid' : errors.description ? 'is-invalid' : ''}`}
                          id="description"
                          name="description"
                          rows={4}
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the issue in detail..."
                        />
                      </div>
                      {errors.description && <div className="text-danger small mt-1"><MDBIcon fas icon="exclamation-circle" className="me-1"/>{errors.description}</div>}
                    </div>

                    <div className="mb-4 image-upload-wrapper p-4 text-center rounded bg-light border border-dashed hover-effect" style={{ borderStyle: 'dashed', borderColor: '#ccc' }}>
                      {!formData.imagePreview ? (
                        <>
                          <MDBIcon fas icon="cloud-upload-alt" size="3x" className="text-muted mb-3" />
                          <h6 className="text-secondary fw-bold">Upload an Image</h6>
                          <p className="text-muted small mb-3">Drag and drop or click to browse</p>
                          <MDBBtn rounded color="light" className="upload-btn border shadow-sm">
                            <label className="mb-0" style={{ cursor: 'pointer' }}>
                              Choose File
                              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </label>
                          </MDBBtn>
                        </>
                      ) : (
                        <div className="position-relative d-inline-block image-preview-container">
                          <img src={formData.imagePreview} alt="Preview" className="img-thumbnail custom-preview-img" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                          <MDBBtn floating color="danger" size="sm" className="position-absolute top-0 end-0 translate-middle remove-image-btn" onClick={clearImage}>
                            <MDBIcon fas icon="times" />
                          </MDBBtn>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="form-section fade-in">
                    <h5 className="mb-4 text-dark fw-bold border-bottom pb-2">Location Tagging</h5>
                    <p className="text-muted mb-3"><MDBIcon fas icon="info-circle" className="me-2 text-info"/> Where is this issue located?</p>
                    
                    {/* Map Placeholder for now - will be integrated later */}
                    <div className="bg-light d-flex align-items-center justify-content-center map-placeholder border rounded mb-3" style={{ height: '300px', backgroundColor: '#e9ecef' }}>
                      <div className="text-center text-muted">
                        <MDBIcon fas icon="map-marked-alt" size="3x" className="mb-2" />
                        <p>Interactive Map Component will render here</p>
                        <small>(See Location Tagging task)</small>
                      </div>
                    </div>
                    
                    <MDBInput
                      label="Selected Address / Coordinates"
                      id="location"
                      name="location"
                      type="text"
                      className="mb-4"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. 123 Main St."
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="form-section fade-in">
                    <h5 className="mb-4 text-dark fw-bold border-bottom pb-2">Review & Submit</h5>
                    
                    <MDBCard className="bg-light border-0 mb-4 review-card shadow-sm">
                      <MDBCardBody>
                        <MDBRow className="mb-3">
                          <MDBCol sm="4"><span className="text-muted fw-bold">Title:</span></MDBCol>
                          <MDBCol sm="8"><span className="text-dark fw-500">{formData.title}</span></MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-3">
                          <MDBCol sm="4"><span className="text-muted fw-bold">Category:</span></MDBCol>
                          <MDBCol sm="8">
                            <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm" style={{ fontSize: '0.9em' }}>
                              {formData.category}
                            </span>
                          </MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-3">
                          <MDBCol sm="4"><span className="text-muted fw-bold">Description:</span></MDBCol>
                          <MDBCol sm="8"><span className="text-dark">{formData.description}</span></MDBCol>
                        </MDBRow>
                        <MDBRow className="mb-3">
                          <MDBCol sm="4"><span className="text-muted fw-bold">Location:</span></MDBCol>
                          <MDBCol sm="8"><span className="text-dark"><MDBIcon fas icon="map-marker-alt" className="text-danger me-1"/> {formData.location || 'Not specified'}</span></MDBCol>
                        </MDBRow>
                        {formData.imagePreview && (
                          <MDBRow>
                            <MDBCol sm="4"><span className="text-muted fw-bold">Image:</span></MDBCol>
                            <MDBCol sm="8">
                              <img src={formData.imagePreview} alt="Attached" className="img-fluid rounded shadow-sm mt-2" style={{ maxHeight: '120px' }} />
                            </MDBCol>
                          </MDBRow>
                        )}
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                )}
                
                {step === 4 && (
                  <div className="text-center fade-in py-5">
                    <div className="success-icon mb-4 text-success mx-auto d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e8f5e9' }}>
                      <MDBIcon fas icon="check" size="3x" />
                    </div>
                    <h4 className="fw-bold mb-2">Report Submitted!</h4>
                    <p className="text-muted">Thank you for contributing. Your issue report has been successfully recorded and is pending review.</p>
                  </div>
                )}

                {step < 4 && (
                  <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                    {step > 1 ? (
                      <MDBBtn outline color="secondary" type="button" onClick={prevStep} rounded className="px-4 fw-bold action-btn">
                        <MDBIcon fas icon="arrow-left" className="me-2" /> Back
                      </MDBBtn>
                    ) : <div></div>}
                    
                    {step < 3 ? (
                      <MDBBtn color="warning" type="button" onClick={nextStep} rounded className="px-4 fw-bold text-dark action-btn shadow-sm" style={{ backgroundColor: '#ff9800', border: 'none' }}>
                        Next <MDBIcon fas icon="arrow-right" className="ms-2" />
                      </MDBBtn>
                    ) : (
                      <MDBBtn color="success" type="submit" rounded className="px-4 fw-bold action-btn shadow-sm pulse-animation" style={{ backgroundColor: '#4caf50' }}>
                        Submit Report <MDBIcon fas icon="paper-plane" className="ms-2" />
                      </MDBBtn>
                    )}
                  </div>
                )}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default SubmitReport;
