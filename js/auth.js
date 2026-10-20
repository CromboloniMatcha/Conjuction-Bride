/* Teacher lock. NOTE: this runs in the browser, so it keeps students out of the editor by accident,
   but it is not real security (anyone who reads the code can bypass it). See README. */
const Auth = (function () {
  const KEY = "cc.admin";
  let memory = false;
  function hash(str) { // cyrb53: small non-cryptographic hash, so the password is not written in plain text
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  return {
    hash,
    check: p => hash(p) === ADMIN_HASH,
    isUnlocked() { try { return sessionStorage.getItem(KEY) === "1" || memory; } catch (e) { return memory; } },
    unlock() { memory = true; try { sessionStorage.setItem(KEY, "1"); } catch (e) {} },
    lock() { memory = false; try { sessionStorage.removeItem(KEY); } catch (e) {} }
  };
})();
