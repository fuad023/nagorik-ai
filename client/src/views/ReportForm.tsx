import { MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBTextArea, MDBValidationItem } from 'mdb-react-ui-kit';
import '../styles/ReportForm.css';
import { useRef, useState } from 'react';
import { Prev } from 'react-bootstrap/esm/PageItem';

export default function ReportForm() {
  const [formData, setFormData] = useState({ location: '', description: '' });
  const [validated, setValidated] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'description' && value.length > 500) return setFormData((Prev) => ({ ...Prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    const form = formRef.current;
    if (!form || !form.checkValidity()) {
      form?.reportValidity();
      return;
    }

    if (!imageFile) {
      setFileError(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate async submission
    await new Promise((res) => setTimeout(res, 2200));

    setIsSubmitting(false);
    setSubmitted(true);

    // Reset after success banner
    setTimeout(() => {
      setFormData({ location: '', description: '' });
      setImageFile(null);
      setPreviewSrc(null);
      setSubmitted(false);
      setValidated(false);
      setFileError(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 4000);
  };

  const descLen = formData.description.length


  return (
    <MDBContainer>
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
      <MDBContainer className="report-card">
        <MDBCardBody className="p-4 p-md-5">
          <MDBValidationItem noValidate className={`row g-4${validated ? ' was-validated' : ''}`} onSubmit={handleSubmit} ref={formRef}>
            {/* Location */}
            <MDBCol size="12">
              <p className="card-section-tittle">
                <i className="fas fa-map-marked-alt mx-2" />
                Location Details
              </p>
              <MDBValidationItem invalid feedback="Please enter a location..">
                <div className="input-icon-wrapper">
                  <MDBInput
                    name="location"
                    value={formData.location}
                    onChange={handleInput}
                    label={
                      <>
                        Location <span className="req">*</span>
                      </>
                    }
                    placeholder="e.g. 42 Elm Street, Downtown"
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </MDBValidationItem>
              <p className="location-hint">
                <i className="fas fa-info-circle" />
                Enter a street address, house, or institution name
              </p>
            </MDBCol>
            {/* Description */}
            <MDBCol size="12">
              <p className="card-section-title">
                <i className="fas fa-file-alt" />
                Issue Description
              </p>
              <MDBValidationItem invalid feedback="Please describe the issue.">
                <div className="input-icon-wrapper textarea-wrapper">
                  <MDBTextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInput}
                    label={
                      <>
                        Description <span className="req">*</span>
                      </>
                    }
                    placeholder="Describe what happened, when you noticed it, and any other relevant details…"
                    rows={5}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </MDBValidationItem>
              <p className={`char-counter${descLen > 500 * 0.9 ? (descLen >= 500 ? ' limit' : ' warn') : ''}`}>
                {descLen} / {500}
              </p>
            </MDBCol>
          </MDBValidationItem>
        </MDBCardBody>
      </MDBContainer>
    </MDBContainer>
  );
}
