      function togglePopup() {
        const popup = document.getElementById('popup');
        popup.classList.toggle('show');
      }
      
      window.onload = () => {
        const api = new JitsiMeetExternalAPI("8x8.vc", {
          roomName: "vpaas-magic-cookie-9e0bef5962b4437b8851826b431c40da/The Mandate School of Ministry Live",
          parentNode: document.querySelector('#jaas-container'),
          // Make sure to include a JWT if you intend to record,
          // make outbound calls or use any other premium features!
          // jwt: "eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtOWUwYmVmNTk2MmI0NDM3Yjg4NTE4MjZiNDMxYzQwZGEvN2MzMmZmLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDk0OTIzOTEsImV4cCI6MTc0OTQ5OTU5MSwibmJmIjoxNzQ5NDkyMzg2LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtOWUwYmVmNTk2MmI0NDM3Yjg4NTE4MjZiNDMxYzQwZGEiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJvdXRib3VuZC1jYWxsIjpmYWxzZSwic2lwLW91dGJvdW5kLWNhbGwiOmZhbHNlLCJ0cmFuc2NyaXB0aW9uIjpmYWxzZSwicmVjb3JkaW5nIjpmYWxzZSwiZmxpcCI6ZmFsc2V9LCJ1c2VyIjp7ImhpZGRlbi1mcm9tLXJlY29yZGVyIjpmYWxzZSwibW9kZXJhdG9yIjp0cnVlLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWQiOiJnb29nbGUtb2F1dGgyfDEwMDE5NDUyMTk5NDc2MTY4NTIzMSIsImF2YXRhciI6IiIsImVtYWlsIjoidGVzdC51c2VyQGNvbXBhbnkuY29tIn19LCJyb29tIjoiKiJ9.Wjz7q8AHt4h2h0FAZ7FTRY7PS47otIVou07SdtALJl9p6aOaqQE-0gb4QuS9l54jDlU7p0eCa4AyjLn72QqD5eKp341QxriOHrsegvWlaay1conYsfvmjvWlxqnRxdcoQaUl8ge8a3YU8VWz8FxT2L5s8kpwwbumnFzD3hImltPbCmiFAauUtNZM81Iql_WDo8i49j1nLBVjbYD7NjHDY-JwHKdQeXr8nqFt6WRswe8ocOts3LNI2LJCZgldsr-dSeqyGjqcwXQ4I0gMcT6Oc0R4jwqP1q3orNrTInnbFDxpThxO5_W8p85U8qkxoHYqdnUgBROfG6gHR7GnGXbPwA"
        });
      } 
