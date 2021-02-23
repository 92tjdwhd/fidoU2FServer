const privateKey = fs.readFileSync("./keypair.key");

createLicense = () => {
  const payload = {
    ipAddress: "192.168.0.8",
    user: "KCX"
  };
  const signOptions = {
    algorithm: "RS256",
    issuer: "keypair",
    subject: "KCX",
    audience: "fido-u2f-kcx",
    notBefore: 0,
    expiresIn: "30d"
  };

  try {
    let token = jwt.sign(payload, privateKey, signOptions);
    let result = Buffer.from(token).toString("base64");
    result = safelib.encode(result.replace(/=/gi, ""));
    return result;
  } catch (err) {
    return err;
  }
};