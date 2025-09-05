// Mock AI Symptom Checker (later replace with ML model)
exports.checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ message: "Symptoms are required" });
  }

  // Very basic logic for prototype
  const suggestions = [];

  // Hypertension (High BP)
  if (symptoms.includes("headaches") || symptoms.includes("dizziness") || symptoms.includes("nosebleeds") || symptoms.includes("blurred vision")) {
    suggestions.push("Possible Hypertension (High BP)");
  }

  // Diabetes (Type 2)
  if (symptoms.includes("frequent urination") || symptoms.includes("excessive thirst") || symptoms.includes("unexplained weight loss") || symptoms.includes("fatigue") || symptoms.includes("slow-healing wounds")) {
    suggestions.push("Possible Diabetes (Type 2)");
  }

  // Metabolic Syndrome / Obesity
  if (symptoms.includes("belly fat") || symptoms.includes("joint pain") || symptoms.includes("high cholesterol") || symptoms.includes("insulin resistance")) {
    suggestions.push("Possible Metabolic Syndrome / Obesity");
  }

  // Anemia (Iron Deficiency)
  if (symptoms.includes("pale skin") || symptoms.includes("cold hands/feet") || symptoms.includes("shortness of breath")) {
    suggestions.push("Possible Anemia (Iron Deficiency)");
  }

  // Cardiovascular Disease
  if (symptoms.includes("chest pain (angina)") || symptoms.includes("swelling in legs") || symptoms.includes("irregular heartbeat")) {
    suggestions.push("Possible Cardiovascular Disease");
  }

  // Stroke / Paralysis Risk
  if (symptoms.includes("sudden numbness") || symptoms.includes("confusion") || symptoms.includes("trouble speaking") || symptoms.includes("trouble seeing")) {
    suggestions.push("Possible Stroke / Paralysis Risk");
  }

  // Respiratory Illness (Asthma / COPD)
  if (symptoms.includes("chronic cough") || symptoms.includes("wheezing") || symptoms.includes("breathlessness") || symptoms.includes("tight chest")) {
    suggestions.push("Possible Respiratory Illness (Asthma / COPD)");
  }

  // Tuberculosis (TB)
  if (symptoms.includes("persistent cough >3 weeks") || symptoms.includes("coughing blood") || symptoms.includes("night sweats") || symptoms.includes("weight loss")) {
    suggestions.push("Possible Tuberculosis (TB)");
  }

  // Seasonal Flu / Viral Fever
  if (symptoms.includes("high fever") || symptoms.includes("sore throat") || symptoms.includes("body aches") || symptoms.includes("runny nose")) {
    suggestions.push("Possible Seasonal Flu / Viral Fever");
  }

  // Cancer
  if (symptoms.includes("lumps") || symptoms.includes("unexplained bleeding") || symptoms.includes("persistent sores")) {
    suggestions.push("Possible Cancer (Breast, Cervical, Oral, GI)");
  }

  // Hepatitis (B/C) & Liver Cirrhosis
  if (symptoms.includes("jaundice") || symptoms.includes("abdominal swelling") || symptoms.includes("dark urine")) {
    suggestions.push("Possible Hepatitis (B/C) or Liver Cirrhosis");
  }

  // Waterborne Diseases
  if (symptoms.includes("loose stools") || symptoms.includes("abdominal cramps") || symptoms.includes("vomiting") || symptoms.includes("dehydration")) {
    suggestions.push("Possible Waterborne Disease");
  }

  // Gastrointestinal Issues
  if (symptoms.includes("burning stomach pain") || symptoms.includes("nausea") || symptoms.includes("bloating") || symptoms.includes("indigestion")) {
    suggestions.push("Possible Gastrointestinal Issues");
  }

  // Skin Diseases
  if (symptoms.includes("itching") || symptoms.includes("rashes") || symptoms.includes("scaling") || symptoms.includes("redness") || symptoms.includes("pus-filled sores")) {
    suggestions.push("Possible Skin Disease");
  }

  // Vector-borne Diseases
  if (symptoms.includes("chills") || symptoms.includes("joint pain") || symptoms.includes("headache") || symptoms.includes("bleeding gums")) {
    suggestions.push("Possible Vector-borne Disease");
  }

  // Eye Problems
  if (symptoms.includes("redness") || symptoms.includes("watery eyes") || symptoms.includes("itching") || symptoms.includes("sensitivity to light")) {
    suggestions.push("Possible Eye Problem");
  }

  // Dental & Oral Health Issues
  if (symptoms.includes("toothache") || symptoms.includes("swollen gums") || symptoms.includes("bad breath") || symptoms.includes("ulcers")) {
    suggestions.push("Possible Dental / Oral Health Issue");
  }

  // Kidney Disorders
  if (symptoms.includes("back pain") || symptoms.includes("swelling in legs") || symptoms.includes("blood in urine")) {
    suggestions.push("Possible Kidney Disorder");
  }

  // Reproductive Health Issues
  if (symptoms.includes("irregular periods") || symptoms.includes("abdominal pain") || symptoms.includes("excessive hair growth") || symptoms.includes("infertility")) {
    suggestions.push("Possible Reproductive Health Issue");
  }

  // Maternal & Child Health Issues
  if (symptoms.includes("low birth weight") || symptoms.includes("malnutrition") || symptoms.includes("anemia in mothers")) {
    suggestions.push("Possible Maternal & Child Health Issue");
  }

  // Mental Health Problems
  if (symptoms.includes("depression") || symptoms.includes("anxiety") || symptoms.includes("substance/alcohol abuse") || symptoms.includes("stress") || symptoms.includes("sleep disorders")) {
    suggestions.push("Possible Mental Health Problem");
  }

  // Drug Addiction & Substance Abuse
  if (symptoms.includes("withdrawal symptoms") || symptoms.includes("mood swings") || symptoms.includes("poor hygiene")) {
    suggestions.push("Possible Drug Addiction / Substance Abuse");
  }

  // Occupational Diseases
  if (symptoms.includes("skin rashes") || symptoms.includes("chronic cough") || symptoms.includes("breathing difficulty") || symptoms.includes("dizziness")) {
    suggestions.push("Possible Occupational Disease");
  }

  // Heat-Related Illnesses
  if (symptoms.includes("heat stroke") || symptoms.includes("fainting") || symptoms.includes("cramps") || symptoms.includes("dehydration")) {
    suggestions.push("Possible Heat-Related Illness");
  }

  // Arthritis & Joint Pain
  if (symptoms.includes("joint stiffness") || symptoms.includes("pain while walking") || symptoms.includes("reduced mobility") || symptoms.includes("swelling")) {
    suggestions.push("Possible Arthritis & Joint Pain");
  }

  if (suggestions.length === 0) {
    suggestions.push("Consult a doctor for further diagnosis");
  }

  res.json({ symptoms, suggestions });
};