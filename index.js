import React, { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [step, setStep] = useState("form"); // form, pillars, calendar
  const [formData, setFormData] = useState({
    niche: "",
    painPoints: "",
    idealCustomer: "",
    brandVoice: "",
    coreOffer: "",
  });

  const [calendar, setCalendar] = useState(null);
  const [pillars, setPillars] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setPillars(data.pillars);
      setCalendar(data.calendar);
      setStep("pillars");
      setCurrentDay(1);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(text);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getPillarColor = (pillarId) => {
    const colors = {
      pillar_1: "bg-orange-50 border-orange-200",
      pillar_2: "bg-blue-50 border-blue-200",
      pillar_3: "bg-green-50 border-green-200",
      pillar_4: "bg-purple-50 border-purple-200",
      pillar_5: "bg-pink-50 border-pink-200",
    };
    return colors[pillarId] || "bg-gray-50 border-gray-200";
  };

  const isFormValid =
    formData.niche &&
    formData.painPoints &&
    formData.idealCustomer &&
    formData.brandVoice &&
    formData.coreOffer;

  return (
    <>
      <Head>
        <title>Content Engine by Apriel Louise</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: #FAF8F3;
            color: #3D2817;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", sans-serif;
            line-height: 1.6;
          }
          h1, h2, h3 {
            font-family: Georgia, serif;
            font-weight: 400;
            letter-spacing: -0.01em;
          }
          button {
            font-size: 16px;
          }
        `}</style>
      </Head>

      <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F3" }}>
        {/* Header */}
        <header
          style={{
            borderBottom: "1px solid #E8DCC8",
            padding: "3rem 2rem",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(250,248,243,0) 0%, rgba(212,175,55,0.02) 100%)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "0.5rem",
              color: "#3D2817",
            }}
          >
            Content Engine
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#6B5344", maxWidth: "650px", margin: "0 auto" }}>
            30-day personalized content calendar for cold traffic conversion
          </p>
        </header>

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
          {/* FORM STEP */}
          {step === "form" && (
            <FormSection
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={generateContent}
              loading={loading}
              error={error}
              isValid={isFormValid}
            />
          )}

          {/* PILLARS STEP */}
          {step === "pillars" && pillars && (
            <PillarsSection
              pillars={pillars}
              onNext={() => setStep("calendar")}
              onBack={() => setStep("form")}
            />
          )}

          {/* CALENDAR STEP */}
          {step === "calendar" && calendar && (
            <CalendarSection
              calendar={calendar}
              pillars={pillars}
              currentDay={currentDay}
              onDayChange={setCurrentDay}
              onBack={() => setStep("pillars")}
              copiedIndex={copiedIndex}
              onCopy={copyToClipboard}
            />
          )}
        </main>

        <footer style={{ borderTop: "1px solid #E8DCC8", padding: "2rem", textAlign: "center", color: "#6B5344", marginTop: "4rem" }}>
          <p>Content Engine by Apriel Louise</p>
        </footer>
      </div>
    </>
  );
}

function FormSection({ formData, onInputChange, onSubmit, loading, error, isValid }) {
  return (
    <div>
      <div style={{ display: "grid", gap: "2rem", marginBottom: "3rem" }}>
        <FormField
          label="Your Niche / Industry"
          name="niche"
          value={formData.niche}
          onChange={onInputChange}
          placeholder="e.g., Wedding photographers, B2B SaaS coaches, Personal finance creators"
        />
        <FormField
          label="Pain Points (What Your Audience Struggles With)"
          name="painPoints"
          value={formData.painPoints}
          onChange={onInputChange}
          placeholder="e.g., Inconsistent bookings, not sure how to position expertise, struggling with lead generation"
          rows={3}
        />
        <FormField
          label="Your Ideal Customer"
          name="idealCustomer"
          value={formData.idealCustomer}
          onChange={onInputChange}
          placeholder="e.g., Female founders aged 28-42, already generating 6 figures, want to scale without burnout"
          rows={3}
        />
        <FormField
          label="Your Brand Voice (How You Speak)"
          name="brandVoice"
          value={formData.brandVoice}
          onChange={onInputChange}
          placeholder="e.g., Candid and no-BS, warm but authoritative, uses humour and storytelling"
          rows={3}
        />
        <FormField
          label="Your Core Offer (What You Sell/Teach)"
          name="coreOffer"
          value={formData.coreOffer}
          onChange={onInputChange}
          placeholder="e.g., A 12-week group programme teaching offer creation and sales funnels"
          rows={3}
        />
      </div>

      {error && (
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "#F0E8E0",
            color: "#6B5344",
            borderRadius: "2px",
            borderLeft: "4px solid #D4AF37",
            marginBottom: "2rem",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || !isValid}
        style={{
          padding: "1.1rem 2.5rem",
          backgroundColor: isValid ? "#3D2817" : "#D4C4B0",
          color: "#FAF8F3",
          border: "none",
          fontSize: "0.95rem",
          fontWeight: "600",
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          borderRadius: "2px",
          transition: "all 0.3s",
        }}
      >
        {loading ? "Generating Your Strategy..." : "Generate 30-Day Calendar"}
      </button>
    </div>
  );
}

function FormField({ label, name, value, onChange, placeholder, rows = 1 }) {
  const isTextarea = rows > 1;
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.9rem",
          fontWeight: "600",
          marginBottom: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#3D2817",
        }}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid #D4C4B0",
            backgroundColor: "#FFFFFF",
            fontSize: "1rem",
            color: "#3D2817",
            fontFamily: "inherit",
            borderRadius: "2px",
            resize: "vertical",
            lineHeight: 1.5,
          }}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "1rem",
            border: "1px solid #D4C4B0",
            backgroundColor: "#FFFFFF",
            fontSize: "1rem",
            color: "#3D2817",
            fontFamily: "inherit",
            borderRadius: "2px",
          }}
        />
      )}
    </div>
  );
}

function PillarsSection({ pillars, onNext, onBack }) {
  return (
    <div>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#3D2817" }}>
        Your Content Pillars
      </h2>
      <p style={{ marginBottom: "2rem", color: "#6B5344", fontSize: "1.05rem" }}>
        These 4-5 pillars form the foundation of your 30-day strategy. Each one serves a different
        purpose in growing your audience and converting cold traffic.
      </p>

      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            style={{
              padding: "2rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8DCC8",
              borderRadius: "2px",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "#3D2817" }}>
              {pillar.name}
            </h3>
            <p style={{ marginBottom: "1rem", color: "#6B5344", fontStyle: "italic" }}>
              {pillar.description}
            </p>
            <p style={{ color: "#6B5344", fontSize: "0.95rem" }}>
              <strong>Examples:</strong> {pillar.examples}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <button
          onClick={onBack}
          style={{
            padding: "0.9rem 2rem",
            backgroundColor: "#E8DCC8",
            color: "#3D2817",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "2px",
          }}
        >
          Back to Form
        </button>
        <button
          onClick={onNext}
          style={{
            padding: "0.9rem 2rem",
            backgroundColor: "#3D2817",
            color: "#FAF8F3",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "2px",
          }}
        >
          View 30-Day Calendar
        </button>
      </div>
    </div>
  );
}

function CalendarSection({ calendar, pillars, currentDay, onDayChange, onBack, copiedIndex, onCopy }) {
  const day = calendar[currentDay - 1];
  if (!day) return null;

  const getPillarName = (id) => {
    return pillars.find((p) => p.id === id)?.name || id;
  };

  return (
    <div>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#3D2817" }}>
        30-Day Content Calendar
      </h2>

      {/* Day Navigation */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8DCC8",
          borderRadius: "2px",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "1rem",
            textTransform: "uppercase",
            color: "#3D2817",
          }}
        >
          Go to Day:
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={currentDay}
          onChange={(e) => onDayChange(parseInt(e.target.value))}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <div style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "600", color: "#3D2817" }}>
          Day {currentDay} of 30
        </div>
      </div>

      {/* Daily Content */}
      <div style={{ display: "grid", gap: "2rem", marginBottom: "3rem" }}>
        {/* Talking Head Script */}
        <ContentBlock
          title="Talking Head Script"
          pillar={getPillarName(day.talkingHeadScript.pillar)}
          duration={day.talkingHeadScript.duration}
          subtitle={day.talkingHeadScript.title}
          content={day.talkingHeadScript.script}
          isCopied={copiedIndex === day.talkingHeadScript.script}
          onCopy={() => onCopy(day.talkingHeadScript.script)}
        />

        {/* Reel */}
        <ContentBlock
          title="Reel (7 seconds)"
          pillar={getPillarName(day.reel.pillar)}
          duration={day.reel.duration}
          content={
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#3D2817" }}>Hook:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.reel.hook}</p>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#3D2817" }}>Body:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.reel.body}</p>
              </div>
              <div>
                <strong style={{ color: "#3D2817" }}>CTA:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.reel.cta}</p>
              </div>
            </div>
          }
          isStructured
          isCopied={
            copiedIndex === `${day.reel.hook}\n${day.reel.body}\n${day.reel.cta}`
          }
          onCopy={() =>
            onCopy(`Hook: ${day.reel.hook}\n\nBody: ${day.reel.body}\n\nCTA: ${day.reel.cta}`)
          }
        />

        {/* Carousel */}
        <ContentBlock
          title={`Carousel (${day.carousel.slideCount} slides)`}
          pillar={getPillarName(day.carousel.pillar)}
          content={
            <div style={{ display: "grid", gap: "1rem" }}>
              {day.carousel.slides.map((slide) => (
                <div
                  key={slide.slideNumber}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#FAFAF8",
                    border: "1px solid #E8DCC8",
                    borderRadius: "2px",
                  }}
                >
                  <strong style={{ color: "#3D2817" }}>Slide {slide.slideNumber}:</strong>
                  <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{slide.text}</p>
                </div>
              ))}
            </div>
          }
          isStructured
          isCopied={copiedIndex === JSON.stringify(day.carousel.slides)}
          onCopy={() => onCopy(JSON.stringify(day.carousel.slides, null, 2))}
        />

        {/* Normal Post */}
        <ContentBlock
          title="Normal Post"
          pillar={getPillarName(day.normalPost.pillar)}
          content={
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#3D2817" }}>Hook:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.normalPost.hook}</p>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <strong style={{ color: "#3D2817" }}>Body:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.normalPost.body}</p>
              </div>
              <div>
                <strong style={{ color: "#3D2817" }}>CTA:</strong>
                <p style={{ color: "#3D2817", marginTop: "0.5rem" }}>{day.normalPost.cta}</p>
              </div>
            </div>
          }
          isStructured
          isCopied={
            copiedIndex ===
            `${day.normalPost.hook}\n${day.normalPost.body}\n${day.normalPost.cta}`
          }
          onCopy={() =>
            onCopy(
              `Hook: ${day.normalPost.hook}\n\nBody: ${day.normalPost.body}\n\nCTA: ${day.normalPost.cta}`
            )
          }
        />
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <button
          onClick={onBack}
          style={{
            padding: "0.9rem 2rem",
            backgroundColor: "#E8DCC8",
            color: "#3D2817",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            borderRadius: "2px",
          }}
        >
          View Pillars
        </button>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => onDayChange(Math.max(1, currentDay - 1))}
            disabled={currentDay === 1}
            style={{
              padding: "0.9rem 2rem",
              backgroundColor: currentDay === 1 ? "#D4C4B0" : "#3D2817",
              color: "#FAF8F3",
              border: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: currentDay === 1 ? "not-allowed" : "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              borderRadius: "2px",
            }}
          >
            ← Previous Day
          </button>
          <button
            onClick={() => onDayChange(Math.min(30, currentDay + 1))}
            disabled={currentDay === 30}
            style={{
              padding: "0.9rem 2rem",
              backgroundColor: currentDay === 30 ? "#D4C4B0" : "#3D2817",
              color: "#FAF8F3",
              border: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: currentDay === 30 ? "not-allowed" : "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              borderRadius: "2px",
            }}
          >
            Next Day →
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentBlock({ title, pillar, duration, subtitle, content, isStructured, isCopied, onCopy }) {
  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8DCC8",
        borderRadius: "2px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "0.3rem", color: "#3D2817" }}>
            {title}
          </h3>
          {pillar && (
            <p style={{ fontSize: "0.85rem", color: "#D4AF37", fontWeight: "600", marginBottom: "0.5rem" }}>
              PILLAR: {pillar}
            </p>
          )}
          {duration && (
            <p style={{ fontSize: "0.85rem", color: "#6B5344" }}>{duration}</p>
          )}
          {subtitle && (
            <p style={{ fontSize: "0.95rem", color: "#6B5344", fontStyle: "italic", marginTop: "0.3rem" }}>
              {subtitle}
            </p>
          )}
        </div>
        <button
          onClick={onCopy}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor: isCopied ? "#D4AF37" : "#FAF8F3",
            color: isCopied ? "#FFFFFF" : "#3D2817",
            border: "1px solid #D4C4B0",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: "600",
            borderRadius: "2px",
            transition: "all 0.2s",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {isCopied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div style={{ color: "#3D2817", lineHeight: "1.7", whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {isStructured ? content : content}
      </div>
    </div>
  );
}
